// The rehearsal and each slide's readable dialogue share one script.
import assert from 'node:assert/strict'
import {readFile, writeFile, mkdir} from 'node:fs/promises'

const root = new URL('../../', import.meta.url)
const talk = JSON.parse(await readFile(new URL('scripts/animation/talk.json', root)))
const map = JSON.parse(await readFile(new URL('presentation/data/slide-script-map.json', root)))
const chapters = new Map(talk.chapters.map(chapter => [chapter.id, chapter]))
const files = new Map(), assigned = [], slides = []
for (const [index, entry] of map.entries()) {
  const chapter = chapters.get(entry.chapter)
  assert(chapter, `Unknown chapter: ${entry.chapter}`)
  const turns = entry.turns.map(turn => {
    assert(chapter.turns[turn], `Missing turn: ${entry.chapter}/${turn}`)
    assigned.push(`${entry.chapter}/${turn}`)
    return chapter.turns[turn]
  })
  const note = '<!--\n' + turns.map(turn => `**${turn.speaker}:**\n\n${turn.text}`).join('\n\n') + '\n-->'
  if (!files.has(entry.file)) files.set(entry.file, [])
  files.get(entry.file).push({note, entry, slide:index + 1})
}
assert.deepEqual(assigned, talk.chapters.flatMap(chapter => chapter.turns.map((_, i) => `${chapter.id}/${i}`)),
  'Every spoken turn must appear once, in order, in the slide notes')
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
    slides.push({slide:row.slide, title, chapter:row.entry.chapter, turns:row.entry.turns,
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
    // The timeout slide reflows literal fields beside a crop of that same trace.
    if (basename === 'java-detail-poster.png') {
      assert(authored.some(slide => slide.title === 'A failed attempt before a working fallback'))
    } else assert(authored.some(slide => slide.visuals.includes(basename)),
      `Video evidence missing from slides: ${chapter.id}/${basename}`)
  }
}
await mkdir(new URL('.artifacts/slides/', root), {recursive:true})
await writeFile(new URL('.artifacts/slides/script-coverage.json', root), JSON.stringify({
  scriptRevision:talk.scriptRevision, chapters:talk.chapters.length, slides:slides.length,
  spokenTurns:assigned.length, allTurnsAssignedOnce:true, allVideoEvidenceRepresented:true, mapping:slides,
}, null, 2) + '\n')
console.log(`Verified ${talk.chapters.length} video chapters, ${slides.length} slides and ${assigned.length} spoken turns; all video evidence is represented.`)
