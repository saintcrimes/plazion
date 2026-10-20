import React, { useId } from 'react';

/** Original vector concepts, deliberately labelled as illustrations in the UI. */
export function ReactorArt({ compact = false }) {
  const id = useId().replace(/:/g, '');
  const fill = (name) => `url(#${id}-${name})`;
  return (
    <svg viewBox="0 0 700 520" className={`reactor-art ${compact ? 'compact' : ''}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-top`} x1="250" y1="80" x2="500" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#8c9b8e" /><stop offset=".5" stopColor="#d3d9cd" /><stop offset="1" stopColor="#a7b5a3" /></linearGradient>
        <linearGradient id={`${id}-side`} x1="430" y1="190" x2="600" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#536650" /><stop offset="1" stopColor="#263b2c" /></linearGradient>
        <linearGradient id={`${id}-front`} x1="230" y1="220" x2="440" y2="410" gradientUnits="userSpaceOnUse"><stop stopColor="#83917b" /><stop offset=".5" stopColor="#bcc7b0" /><stop offset="1" stopColor="#7c8d70" /></linearGradient>
        <linearGradient id={`${id}-inner`} x1="260" y1="200" x2="420" y2="370" gradientUnits="userSpaceOnUse"><stop stopColor="#101e17" /><stop offset="1" stopColor="#3c5035" /></linearGradient>
        <linearGradient id={`${id}-mesh`}><stop stopColor="#cbd8bd" /><stop offset=".5" stopColor="#8eaa79" /><stop offset="1" stopColor="#bad69f" /></linearGradient>
        <linearGradient id={`${id}-flow`}><stop stopColor="#7d927e" stopOpacity="0" /><stop offset=".42" stopColor="#a0bb7c" stopOpacity=".5" /><stop offset="1" stopColor="#a4db54" stopOpacity=".9" /></linearGradient>
        <radialGradient id={`${id}-halo`}><stop stopColor="#c4e88c" stopOpacity=".4" /><stop offset="1" stopColor="#c4e88c" stopOpacity="0" /></radialGradient>
        <filter id={`${id}-shadow`} x="-40%" y="-100%" width="180%" height="300%"><feGaussianBlur stdDeviation="15" /></filter>
        <pattern id={`${id}-grid`} width="11" height="11" patternUnits="userSpaceOnUse"><path d="M0 0H11V11" stroke="#bad6a0" strokeWidth=".6" opacity=".65" /><circle cx="5.5" cy="5.5" r="1.2" fill="#263b2c" /></pattern>
        <pattern id={`${id}-vents`} width="10" height="16" patternUnits="userSpaceOnUse"><rect width="3" height="10" rx="1.5" x="4" y="3" fill="#162a1d" /></pattern>
      </defs>
      <ellipse cx="391" cy="429" rx="223" ry="30" fill="#253c23" opacity=".18" filter={fill('shadow')} />
      <circle cx="365" cy="255" r="235" fill={fill('halo')} />
      {!compact && <g className="orbital-guides" stroke="#92a284" strokeWidth=".7" opacity=".35"><ellipse cx="372" cy="268" rx="289" ry="141" transform="rotate(-22 372 268)" strokeDasharray="3 9" /><ellipse cx="372" cy="268" rx="262" ry="196" transform="rotate(23 372 268)" strokeDasharray="2 10" /><circle cx="99" cy="241" r="4" fill="#b4d780" /><circle cx="600" cy="343" r="4" fill="#b4d780" /></g>}
      <g className="reactor-body">
        <path d="M251 165 416 99 568 184 404 252Z" fill={fill('top')} stroke="#d5ddcf" strokeWidth="1.1" />
        <path d="M404 252 568 184V381L404 449Z" fill={fill('side')} stroke="#758970" strokeWidth="1.2" />
        <path d="M251 165 404 252V449L251 362Z" fill={fill('front')} stroke="#c9d3bf" strokeWidth="1.3" />
        <path d="M264 188 390 260V425L264 353Z" fill={fill('inner')} stroke="#d7e0ce" strokeWidth="3" />
        <path d="m270 199 112 64v143l-112-64Z" fill="#27392a" />
        {Array.from({ length: 13 }, (_, i) => <path key={i} d={`m${277 + i * 7.8} ${205 + i * 4.5}v128l4 2.3V${207.3 + i * 4.5}`} fill={i % 2 ? '#789568' : '#a0b88c'} opacity={0.55 + (i / 30)} />)}
        <path d="m267 263 114 65M267 271l114 65" stroke="#d6e5c6" opacity=".3" />
        <path d="M422 267 550 214V366L422 419Z" fill="#29432f" stroke="#94a78a" strokeWidth=".75" />
        <path d="M437 287 531 249V343L437 382Z" fill={fill('vents')} opacity=".85" />
        <path d="m476 258 36-15v28l-36 15Z" fill="#162c1d" stroke="#719065" />
        <path d="m483 263 21-8v6l-21 8Z" fill="#c3ee87" />
        <circle cx="489" cy="278" r="2.5" fill="#b6ee72" className="status-light" />
        <path d="M278 162 414 109l123 69-135 56Z" stroke="#6d7e68" strokeWidth=".7" />
        <path d="m305 160 105-41 102 57-105 43Z" fill="#9eae92" opacity=".45" />
        <g fill="#e4e9da" opacity=".8"><circle cx="268" cy="174" r="2" /><circle cx="393" cy="248" r="2" /><circle cx="393" cy="433" r="2" /><circle cx="261" cy="356" r="2" /><circle cx="554" cy="194" r="2" /><circle cx="554" cy="374" r="2" /></g>
        <path d="m265 365 14 8v23l-14-8Z" fill="#253827" /><path d="m387 437 14 8v21l-14-8Z" fill="#253827" /><path d="m545 387 14-6v20l-14 6Z" fill="#203625" />
        <g transform="matrix(.86 -.35 0 1 438 401)"><text fill="#d8e5c9" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="12" letterSpacing="1.8">PLazion</text><text y="11" fill="#92ac82" fontFamily="monospace" fontSize="5.5" letterSpacing="1.1">GL-JD-6A</text></g>
      </g>
      <g className="reactor-panel">
        <path d="m158 213 84-34 0 174-84 34Z" fill="#37532d" stroke="#95ad7e" strokeWidth="2" />
        <path d="m151 207 84-34 7 6-84 34Z" fill="#d7e0c9" stroke="#a5ba91" />
        <path d="m151 207 7 6v174l-7-6Z" fill="#afc697" />
        <path d="m167 220 65-26v151l-65 26Z" fill={fill('mesh')} stroke="#d6e4c5" strokeWidth="1.5" />
        <path d="m167 220 65-26v151l-65 26Z" fill={fill('grid')} />
        <path d="m182 245 36-14v74l-36 14Z" stroke="#e1edcf" opacity=".65" />
        <path d="m181 254 37-15M181 262l37-15M181 270l37-15M181 278l37-15M181 286l37-15M181 294l37-15" stroke="#5b7d48" strokeWidth="2" />
      </g>
      {!compact && <g className="airflow-paths" stroke={fill('flow')} strokeWidth="1.6" strokeLinecap="round">
        <path d="M27 286c67-51 100-2 159-29s80-41 131 0 85 63 152 8 113-73 198-47" /><path d="M18 307c72-50 106 3 169-25s81-39 130 0 90 60 153 9 121-75 209-49" /><path d="M36 329c64-43 100 2 156-23s79-35 126 0 88 56 152 9 120-73 204-48" />
      </g>}
      {!compact && <g className="air-particles" fill="#a1ca6e"><circle r="3.5" cx="65" cy="280" /><circle r="2" cx="113" cy="278" /><circle r="3" cx="595" cy="221" /><circle r="2.5" cx="633" cy="250" /><circle r="2" cx="562" cy="279" /></g>}
    </svg>
  );
}

export function HybridArt() {
  return <svg viewBox="0 0 500 330" fill="none" className="component-art" aria-hidden="true">
    <defs><linearGradient id="hybrid-face"><stop stopColor="#dce2d4" /><stop offset="1" stopColor="#a6b99a" /></linearGradient><pattern id="hybrid-pleats" width="13" height="13" patternUnits="userSpaceOnUse"><path d="M2 0v13M6 0v13" stroke="#6f8262" strokeWidth="2" /><path d="M10 0v13" stroke="#eef1e6" strokeWidth="2" /></pattern></defs>
    <ellipse cx="260" cy="286" rx="143" ry="16" fill="#374b2b" opacity=".1" />
    <g className="hybrid-back"><path d="m255 87 103 30v143l-103-30Z" fill="#354733" /><path d="m255 87 17-15 103 30-17 15Z" fill="#77866c" /><path d="m358 117 17-15v143l-17 15Z" fill="#1f3020" /><path d="m266 104 81 24v113l-81-24Z" fill="#1b2e1f" />{Array.from({ length: 10 }, (_, i) => <path key={i} d={`m${270+i*7.5} ${110+i*2.2}v101`} stroke="#4c6744" strokeWidth="2" />)}</g>
    <g className="hybrid-front"><path d="m137 115 108 31v143l-108-31Z" fill="url(#hybrid-face)" stroke="#d9e2ce" /><path d="m137 115 18-16 108 31-18 16Z" fill="#e2e8d8" /><path d="m245 146 18-16v143l-18 16Z" fill="#819573" /><path d="m148 133 86 24v111l-86-24Z" fill="url(#hybrid-pleats)" stroke="#748669" strokeWidth="2" /></g>
    <path d="m101 182 34-13m121 21 35-13m95 22 31-12" stroke="#89aa66" strokeDasharray="3 4" /><path d="m411 181 9 4-5 9" stroke="#89aa66" strokeWidth="1.5" />
  </svg>;
}

export function SensorArt() {
  return <svg viewBox="0 0 500 330" fill="none" className="component-art" aria-hidden="true">
    <ellipse cx="252" cy="285" rx="121" ry="15" fill="#374b2b" opacity=".1" />
    <g className="sensor-device"><path d="m171 95 111-26 55 34-111 27Z" fill="#dde4d5" stroke="#cbd6be" /><path d="m171 95 55 35v150l-55-35Z" fill="#a0b090" /><path d="m226 130 111-27v151l-111 26Z" fill="#e0e7d8" stroke="#c5d2ba" />
      <path d="m242 145 79-19v70l-79 19Z" fill="#263d2a" /><path d="m250 174 10-3 8-15 9 24 10-24 8 10 17-4" stroke="#bce68d" strokeWidth="2" strokeLinejoin="round" />
      <g fill="#8fa27e">{Array.from({ length: 6 }, (_,i)=><path key={i} d={`m${244+i*13} ${230-i*3.2}v18l4-1v-18Z`}/>)}</g><circle cx="315" cy="210" r="3.5" fill="#88b54a" />
      <path d="m183 144 28 17v5l-28-17Zm0 12 28 17v5l-28-17Zm0 12 28 17v5l-28-17Z" fill="#697e5b" />
    </g><g className="sensor-waves" stroke="#8ca774" strokeWidth="1.5" strokeLinecap="round"><path d="M349 104q25 11 16 38M362 90q38 18 26 57M375 77q51 23 34 75" /></g>
  </svg>;
}
