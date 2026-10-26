import React, { useEffect, useState } from 'react';
import { Wind } from 'lucide-react';

const visitKey = 'plazion-fresh-air-seen';
const labels = { en: 'A breath of fresh air.', ru: 'Глоток свежего воздуха.', uz: 'Bir nafas toza havo.' };

export default function FreshAirEntrance({ language, paused }) {
  const [visible, setVisible] = useState(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try { return !sessionStorage.getItem(visitKey); } catch { return true; }
  });
  useEffect(() => {
    if (!visible) return;
    try { sessionStorage.setItem(visitKey, '1'); } catch { /* Animation can work without storage. */ }
    const finish = () => setVisible(false);
    const timeout = window.setTimeout(finish, 3000);
    // Let visitors dismiss the decoration immediately without capturing their input.
    window.addEventListener('pointerdown', finish, { once: true });
    window.addEventListener('keydown', finish, { once: true });
    return () => { clearTimeout(timeout); window.removeEventListener('pointerdown', finish); window.removeEventListener('keydown', finish); };
  }, [visible]);
  useEffect(() => { if (paused) setVisible(false); }, [paused]);
  if (!visible) return null;
  return <div className="fresh-air-entrance" aria-hidden="true">
    <div className="fresh-air-haze" />
    <svg className="fresh-air-ribbons" viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none">
      {[0, 1, 2, 3, 4, 5].map(i => <path key={i} style={{ '--ribbon-index': i }} d={`M-300 ${250 + i * 46} C 100 ${60 + i * 35}, 390 ${640 - i * 14}, 740 ${320 + i * 24} S 1260 ${180 + i * 40}, 1760 ${370 + i * 30}`} />)}
    </svg>
    <div className="fresh-air-motes">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ '--mote-index': i, top: `${15 + (i * 17 % 70)}%`, left: `${i * 7 % 100}%` }} />)}</div>
    <div className="fresh-air-greeting"><Wind size={28} strokeWidth={1} /><span>{labels[language] || labels.en}</span></div>
  </div>;
}
