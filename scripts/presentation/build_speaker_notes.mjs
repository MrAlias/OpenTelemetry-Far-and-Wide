// The rehearsal and each slide's readable dialogue share one script.
import assert from 'node:assert/strict'
import {readFile, writeFile, mkdir} from 'node:fs/promises'

const root = new URL('../../', import.meta.url)
const talk = JSON.parse(await readFile(new URL('scripts/animation/talk.json', root)))
const map = JSON.parse(await readFile(new URL('presentation/data/slide-script-map.json', root)))
const chapters = new Map(talk.chapters.map(chapter => [chapter.id, chapter]))
const files = new Map(), assigned = [], slides = []
let additionalLiveTurns = 0
for (const [index, entry] of map.entries()) {
  const chapter = chapters.get(entry.chapter)
  assert(chapter, `Unknown chapter: ${entry.chapter}`)
  const noteOverrides = entry.noteOverrides || {}
  for (const [turn, override] of Object.entries(noteOverrides)) {
    assert(entry.turns.includes(Number(turn)), `Note override references an unmapped turn: ${entry.chapter}/${turn}`)
    assert(Object.keys(override).every(key => ['speaker', 'text'].includes(key)), 'Unknown note override field')
    if (override.speaker !== undefined) assert(['Tyler', 'Nikola'].includes(override.speaker), `Unknown note speaker: ${override.speaker}`)
    if (override.text !== undefined) assert(typeof override.text === 'string' && override.text.trim(), 'Note text must be nonempty')
  }
  const turns = entry.turns.map(turn => {
    assert(chapter.turns[turn], `Missing turn: ${entry.chapter}/${turn}`)
    assigned.push(`${entry.chapter}/${turn}`)
    return {...chapter.turns[turn], ...noteOverrides[turn]}
  })
  if (entry.demoReturn) assert.equal(turns[0].speaker, 'Tyler',
    `Slide ${index + 1}: Tyler must resume when returning from the demo`)
  const clickMarkers = entry.noteClicks || []
  let previousClick = 0
  const clickByTurn = new Map()
  for (const marker of clickMarkers) {
    assert(Number.isInteger(marker.at) && marker.at > previousClick, 'Note clicks must advance in order')
    assert(entry.turns.includes(marker.turn), `Note click references an unmapped turn: ${entry.chapter}/${marker.turn}`)
    assert(!clickByTurn.has(marker.turn), 'Only one click marker may precede a turn')
    clickByTurn.set(marker.turn, marker.at - previousClick)
    previousClick = marker.at
  }
  const extraTurns = entry.extraTurns || []
  for (const turn of extraTurns) {
    assert(entry.turns.includes(turn.after), 'Additional live turn needs a mapped preceding turn')
    assert(['Tyler', 'Nikola'].includes(turn.speaker), 'Unknown additional live speaker')
    assert(typeof turn.text === 'string' && turn.text.trim(), 'Additional live text must be nonempty')
  }
  additionalLiveTurns += extraTurns.length
  const note = '<!--\n' + turns.map((turn, i) => {
    const click = clickByTurn.get(entry.turns[i])
    const prefix = click ? `[click${click === 1 ? '' : ':' + click}]\n\n` : ''
    const following = extraTurns.filter(extra => extra.after === entry.turns[i])
      .map(extra => `**${extra.speaker}:**\n\n${extra.text}`)
    return [`${prefix}**${turn.speaker}:**\n\n${turn.text}`, ...following].join('\n\n')
  }).join('\n\n') + '\n-->'
  if (!files.has(entry.file)) files.set(entry.file, [])
  files.get(entry.file).push({note, entry, slide:index + 1})
}
assert.deepEqual(assigned.toSorted(), talk.chapters.flatMap(chapter => chapter.turns.map((_, i) => `${chapter.id}/${i}`)).toSorted(),
  'Every recorded turn must appear once in the live slide notes, including reordered slides')
for (const [file, entries] of files) {
  const source = await readFile(new URL(file, root), 'utf8')
  const comments = source.match(/<!--[\s\S]*?-->/g) || []
  assert.equal(comments.length, entries.length, `${file}: slide notes and script mapping differ`)
  let i = 0, cursor = 0
  const updated = source.replace(/<!--[\s\S]*?-->/g, (old, offset) => {
    const row = entries[i++]
    const body = source.slice(cursor, offset); cursor = offset + old.length
    const title = body.match(/^# (.+)$/m)?.[1]
    assert(title, `${file}: mapped slide has no title`)
    const clickCount = Number(body.match(/^clicks: (\d+)$/m)?.[1] || 0)
    assert.equal(row.entry.noteClicks?.at(-1)?.at || 0, clickCount,
      `${file}: every visual click must have a matching note marker`)
    slides.push({slide:row.slide, title, chapter:row.entry.chapter, turns:row.entry.turns,
      noteClicks:row.entry.noteClicks || [],
      demoReturn:!!row.entry.demoReturn, firstSpeaker:row.entry.noteOverrides?.[row.entry.turns[0]]?.speaker || chapters.get(row.entry.chapter).turns[row.entry.turns[0]].speaker,
      components:[...body.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map(match => match[1]),
      visuals:[...body.matchAll(/(?:src|image|poster)="([^"]+)"/g)].map(match => match[1].split('/').at(-1))})
    return row.note
  })
  if (process.argv.includes('--check')) assert.equal(source, updated, `${file}: notes are stale`)
  else await writeFile(new URL(file, root), updated)
}
const representations = new Map(slides.map(slide => [slide.chapter, []]))
for (const slide of slides) representations.get(slide.chapter).push(slide)
for (const chapter of talk.chapters) {
  const authored = representations.get(chapter.id)
  assert(authored?.length, `No slide for video chapter ${chapter.id}`)
  for (const visual of chapter.visuals || []) {
    if (visual.type === 'art') continue
    const basename = visual.src.split('/').at(-1)
    // Native screenshot views carry the same recorded timeout evidence.
    if (basename === 'java-detail-poster.png') {
      assert(authored.some(slide => slide.components.includes('TimeoutEvidence')))
    } else assert(authored.some(slide => slide.visuals.includes(basename)),
      `Video evidence missing from slides: ${chapter.id}/${basename}`)
  }
}
await mkdir(new URL('.artifacts/slides/', root), {recursive:true})
await writeFile(new URL('.artifacts/slides/script-coverage.json', root), JSON.stringify({
  scriptRevision:talk.scriptRevision, chapters:talk.chapters.length, slides:slides.length,
  spokenTurns:assigned.length + additionalLiveTurns, recordedTurns:assigned.length, additionalLiveTurns, allTurnsAssignedOnce:true, allVideoEvidenceRepresented:true, mapping:slides,
}, null, 2) + '\n')
console.log(`Verified ${talk.chapters.length} video chapters, ${slides.length} slides and ${assigned.length + additionalLiveTurns} live spoken turns; all video evidence is represented.`)
