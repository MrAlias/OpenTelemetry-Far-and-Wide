// Reuse the deck's checked-in QR vectors in the animation and storyboard.
import {readFile, writeFile} from 'node:fs/promises'

const resources = [
  {label:'Demo + slides', url:'https://github.com/MrAlias/OpenTelemetry-Far-and-Wide', file:'qr-demo-source.svg'},
  {label:'RIO', url:'https://github.com/otelx/rio', file:'qr-rio.svg'},
]
const injector = JSON.parse(await readFile(new URL('../../presentation/data/injector-intro.json', import.meta.url)))
const injectorResource = {label:'Project + docs', url:injector.url, file:injector.qr, runtimes:injector.runtimes}
for (const resource of [...resources, injectorResource]) {
  const svg = await readFile(new URL('../../public/presentation/' + resource.file, import.meta.url), 'utf8')
  resource.size = Number(svg.match(/viewBox="0 0 (\d+) /)[1])
  resource.markup = svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'))
    .replace(/"100%"/g, '"' + resource.size + '"')
}
const diagram = await readFile(new URL('../../presentation/injector-diagram.js', import.meta.url), 'utf8')
await writeFile(new URL('../../public/animation/resources.js', import.meta.url),
  '// Generated from the deck QR vectors; do not edit.\nwindow.CLOSING_RESOURCES = ' + JSON.stringify(resources) + ';\n'
  + 'window.INJECTOR_RESOURCE = ' + JSON.stringify(injectorResource) + ';\n'
  + '(()=>{\n' + diagram.replace(/^export /gm, '') + '\nwindow.renderInjectorDiagram=renderInjectorDiagram;\n})();\n')
console.log('Packaged the closing resource QR codes for the review player')
