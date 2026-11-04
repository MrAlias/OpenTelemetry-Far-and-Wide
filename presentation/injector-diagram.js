// Shared by the Slidev intro and its portable storyboard.
export function renderInjectorDiagram({ palette = {}, runtimes = ['Java', 'Node.js', 'Python', '.NET', 'Ruby'] } = {}) {
  const c = { ink: 'var(--ink)', muted: 'var(--muted)', line: 'var(--line)', surface: 'var(--surface)', accent: 'var(--accent)', agent: 'var(--agent)', ...palette }
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440" role="img" aria-label="At application process startup, the OpenTelemetry Injector loads a language agent inside that process. The demo bundles Java, Node.js, Python, .NET and Ruby agents.">
    <text x="0" y="34" font-size="28" fill="${c.ink}">At process startup</text>
    <rect x="1" y="70" width="798" height="280" rx="10" fill="none" stroke="${c.line}" stroke-width="2"/>
    <text x="25" y="110" font-size="22" fill="${c.muted}">Application process</text>
    <g fill="none" stroke="${c.accent}" stroke-width="3"><path d="M200 220H250M239 209L250 220L239 231M485 220H535M524 209L535 220L524 231"/></g>
    <rect x="30" y="155" width="170" height="130" rx="6" fill="${c.surface}" stroke="${c.line}" stroke-width="2"/>
    <path d="M97 181L81 195L97 209M133 181L149 195L133 209M120 177L110 213" stroke="${c.ink}" stroke-width="3" fill="none"/>
    <text x="115" y="255" text-anchor="middle" font-size="28" fill="${c.ink}">Service</text>
    <rect x="260" y="155" width="225" height="130" rx="6" fill="${c.surface}" stroke="${c.accent}" stroke-width="2"/>
    <text x="372.5" y="209" text-anchor="middle" font-size="30" fill="${c.accent}">Injector</text>
    <text x="372.5" y="248" text-anchor="middle" font-size="19" font-family="monospace" fill="${c.muted}">libotelinject.so</text>
    <rect x="545" y="155" width="225" height="130" rx="6" fill="${c.surface}" stroke="${c.agent}" stroke-width="2"/>
    <text x="657.5" y="195" text-anchor="middle" font-size="23" fill="${c.muted}">Load matching</text>
    <text x="657.5" y="235" text-anchor="middle" font-size="24" fill="${c.agent}">Language agent</text>
    <path d="M609 255H647M625 266H675M657 255H703" stroke="${c.agent}" stroke-width="5" stroke-linecap="round"/>
    <text x="400" y="414" text-anchor="middle" font-size="27" fill="${c.ink}">${runtimes.map(escape).join(' · ')}</text>
  </svg>`
}
