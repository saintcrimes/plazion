'use client';

// PLAZION adaptation of the supplied Agentic Factory interaction design.
// Procedural photo-based geometry; airflow illustrates the process, not measured CFD.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Box, Layers3, ScanLine, Wind, Pause, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPlazionModel, type StationId } from './plazion-model';
import './agentic-factory-3d.css';

export type { StationId } from './plazion-model';
export type MachineMode = 'assembled' | 'cutaway' | 'stations' | 'airflow';
export type MachineCamera = 'overview' | 'side' | 'top' | 'station' | 'flight';
export type MachineApi = { setMode: (mode: MachineMode) => void; setCamera: (view: MachineCamera) => void; focusStation: (id: StationId) => void; play: () => void; pause: () => void };
export type AgenticFactory3DProps = {
  height?: number | string; className?: string; embed?: boolean; language?: 'ru' | 'en' | 'uz'; paused?: boolean;
  onStation?: (id: StationId) => void; onReady?: () => void; onPauseChange?: (paused: boolean) => void;
};
const text = {
  en: { modes: ['Assembled', 'Cutaway', 'Stations', 'Fresh air'], cameras: ['Overview', 'Side', 'Top', 'Focus', 'Orbit'], stations: ['Air inlet', 'Plasma reactor', 'ESP collector', 'Blower', 'Clean air outlet'], descriptions: ['Distributes incoming air across the treatment chambers.', 'Reactive species promote oxidation of gaseous contaminants.', 'Charged particles migrate to collector plates.', 'Maintains airflow through the treatment train.', 'Illustrative clean-air plume after treatment.'], hint: 'Drag to rotate · select a module', label: 'Interactive PLAZION air purification prototype', pause: 'Pause airflow', play: 'Resume airflow', fallback: '3D unavailable. Showing the real prototype.', reset: 'Reset camera', illustration: 'Concept airflow · not a measured simulation', loading: 'Assembling PLAZION', view: 'Camera view', mode: 'Model mode' },
  ru: { modes: ['Сборка', 'Разрез', 'Модули', 'Чистый воздух'], cameras: ['Обзор', 'Сбоку', 'Сверху', 'Фокус', 'Орбита'], stations: ['Вход воздуха', 'Плазменный реактор', 'ESP-осадитель', 'Вентилятор', 'Выход чистого воздуха'], descriptions: ['Распределяет входящий поток по камерам обработки.', 'Активные частицы способствуют окислению газовых примесей.', 'Заряженные частицы оседают на электродах.', 'Поддерживает поток через систему очистки.', 'Условный поток чистого воздуха после обработки.'], hint: 'Перетаскивайте модель · выберите модуль', label: 'Интерактивный прототип системы очистки PLAZION', pause: 'Приостановить поток', play: 'Возобновить поток', fallback: '3D недоступно. Показана фотография прототипа.', reset: 'Сбросить камеру', illustration: 'Концепция потока · не измеренная симуляция', loading: 'Собираем PLAZION', view: 'Ракурс камеры', mode: 'Режим модели' },
  uz: { modes: ['Yig‘ilgan', 'Kesim', 'Modullar', 'Toza havo'], cameras: ['Umumiy', 'Yon', 'Yuqori', 'Fokus', 'Orbita'], stations: ['Havo kirishi', 'Plazma reaktori', 'ESP kollektori', 'Ventilyator', 'Toza havo chiqishi'], descriptions: ['Kirish oqimini ishlov berish kameralariga taqsimlaydi.', 'Faol zarrachalar gazsimon aralashmalar oksidlanishiga yordam beradi.', 'Zaryadlangan zarrachalar kollektor plastinalariga cho‘kadi.', 'Tozalash tizimi orqali oqimni ta’minlaydi.', 'Ishlov berilgandan keyingi toza havo oqimi tasviri.'], hint: 'Aylantirish uchun torting · modulni tanlang', label: 'PLAZION havo tozalash prototipining interaktiv modeli', pause: 'Oqimni to‘xtatish', play: 'Oqimni davom ettirish', fallback: '3D mavjud emas. Haqiqiy prototip rasmi ko‘rsatilgan.', reset: 'Kamerani tiklash', illustration: 'Oqim konsepsiyasi · o‘lchangan simulyatsiya emas', loading: 'PLAZION yig‘ilmoqda', view: 'Kamera ko‘rinishi', mode: 'Model rejimi' },
};
const ids: StationId[] = ['inlet', 'plasma', 'collector', 'blower', 'outlet'];
const modes: MachineMode[] = ['assembled', 'cutaway', 'stations', 'airflow'];
const cameras: MachineCamera[] = ['overview', 'side', 'top', 'station', 'flight'];
const icons = [Box, ScanLine, Layers3, Wind];

export default function AgenticFactory3D({ height = '100%', className, embed = false, language = 'en', paused = false, onStation, onReady, onPauseChange }: AgenticFactory3DProps) {
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<MachineApi | null>(null);
  const callbacks = useRef({ onStation, onReady, onPauseChange });
  callbacks.current = { onStation, onReady, onPauseChange };
  const [mode, setMode] = useState<MachineMode>('airflow');
  const [camera, setCamera] = useState<MachineCamera>('overview');
  const [selected, setSelected] = useState<StationId | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [stopped, setStopped] = useState(paused);
  const t = text[language];

  useEffect(() => {
    setStopped(paused);
    if (paused) api.current?.pause(); else api.current?.play();
  }, [paused]);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); }
    catch { setFailed(true); return; }
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = matchMedia('(pointer: coarse)').matches;
    let playing = !paused && !media.matches, currentMode: MachineMode = 'airflow', currentCamera: MachineCamera = 'overview';
    let active: StationId = 'plasma', visible = true, lost = false, time = 0, last = 0, raf = 0, interacting = false, transitioning = false;
    let width = 1, heightPx = 1, distance = 16;
    let offscreen = false;
    const scene = new THREE.Scene();
    const camera3D = new THREE.PerspectiveCamera(33, 1, .1, 100);
    renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.25 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    node.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', text[language].label);
    const controls = new OrbitControls(camera3D, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = .07; controls.enablePan = false;
    controls.enableZoom = false; // Wheel and one-finger touch keep scrolling the page.
    controls.minDistance = 5; controls.maxDistance = 28; controls.maxPolarAngle = Math.PI * .47;
    controls.rotateSpeed = .5;
    if (coarse) { controls.enableRotate = false; renderer.domElement.style.touchAction = 'pan-y'; }
    const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
    const env = pmrem.fromScene(room, .04); scene.environment = env.texture; scene.environmentIntensity = .45; room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xf5ffe9, 0x1c3c31, 2.1));
    const key = new THREE.DirectionalLight(0xffefda, 3.5); key.position.set(-4, 9, 5); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.normalBias = .04;
    Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 }); scene.add(key);
    const rim = new THREE.DirectionalLight(0xb6eddb, 2); rim.position.set(6, 5, -5); scene.add(rim);
    const { model, environment, stations, rotor, cutPlane } = createPlazionModel(); scene.add(model);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: .15 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -.22; floor.receiveShadow = true; scene.add(floor);
    // Soft-edged sprites form a continuous plume; no video or external texture.
    const spriteCanvas = document.createElement('canvas'); spriteCanvas.width = spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32,32,0,32,32,32); grad.addColorStop(0,'rgba(255,255,255,.7)'); grad.addColorStop(.25,'rgba(255,255,255,.25)'); grad.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle = grad; ctx.fillRect(0,0,64,64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);
    const n = coarse ? 900 : 1800, positions = new Float32Array(n * 3), colors = new Float32Array(n * 3);
    const seeds = Array.from({length:n}, () => ({ phase: Math.random(), angle: Math.random()*Math.PI*2, radial: Math.random() }));
    const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3)); particleGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const particleMaterial = new THREE.PointsMaterial({ map: sprite, size: .36, transparent: true, opacity: .42, depthWrite: false, vertexColors: true, blending: THREE.NormalBlending });
    const plume = new THREE.Points(particleGeometry, particleMaterial); model.add(plume);
    const intakeCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-4.8,1,1.5),new THREE.Vector3(-2.85,.9,1.5),new THREE.Vector3(-1.9,.9,1.5),new THREE.Vector3(-.95,.8,1.5),new THREE.Vector3(.2,.9,1.5),new THREE.Vector3(2.6,1.5,1.2),new THREE.Vector3(2.6,2.92,1.2)]);
    const flowCurves = Array.from({length:3},(_,i)=>{
      const pts = Array.from({length:50},(_,j)=>{const p=intakeCurve.getPoint(j/49);p.z+=(i-1)*.12;return p;});
      const geometry = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geometry,new THREE.LineDashedMaterial({color:0x99ddbf,transparent:true,opacity:.35,dashSize:.16,gapSize:.12}));line.computeLineDistances();model.add(line);return line;
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.47,.012,8,48),new THREE.MeshBasicMaterial({color:0xc9f799,transparent:true,opacity:.7}));
    ring.rotation.x=Math.PI/2;ring.position.set(2.6,2.94,1.2);model.add(ring);
    const desiredPosition = new THREE.Vector3(), desiredTarget = new THREE.Vector3(0,.9,0);
    const direction = new THREE.Vector3(7.5,6.7,10).normalize();
    function goal(instant = false) {
      const station = stations.find(s=>s.id===active)!;
      desiredTarget.set(0,1.05,0);
      if(currentCamera==='station') { desiredTarget.copy(station.group.position).add(new THREE.Vector3(0,.4,0)); desiredPosition.copy(desiredTarget).addScaledVector(direction, 5.3); }
      else if(currentCamera==='top') desiredPosition.set(.01,distance,0).add(desiredTarget);
      else if(currentCamera==='side') desiredPosition.set(0,3,distance).add(desiredTarget);
      else desiredPosition.copy(desiredTarget).addScaledVector(direction,distance*(currentMode==='stations'?1.12:1));
      transitioning=true;
      if(instant || media.matches){camera3D.position.copy(desiredPosition);controls.target.copy(desiredTarget);controls.update();transitioning=false;}
    }
    function resize() {
      width=node!.clientWidth; heightPx=node!.clientHeight;
      if(!width||!heightPx)return;
      renderer.setSize(width,heightPx); camera3D.aspect=width/heightPx;camera3D.updateProjectionMatrix();
      distance=Math.max(15, 9.2 / (2*Math.tan(THREE.MathUtils.degToRad(16.5))*camera3D.aspect));
      controls.maxDistance=Math.max(28,distance*1.5);goal(true);
    }
    const localApi: MachineApi = {
      setMode(next){currentMode=next;goal(media.matches);},
      setCamera(next){currentCamera=next;interacting=false;goal(media.matches);},
      focusStation(id){active=id;currentCamera='station';setSelected(id);setCamera('station');goal(media.matches);},
      play(){playing=!media.matches;setStopped(media.matches);}, pause(){playing=false;setStopped(true);},
    };
    api.current=localApi;
    const resizer=new ResizeObserver(resize);resizer.observe(node);resize();
    const observer=new IntersectionObserver(([entry])=>{offscreen=!entry.isIntersecting;visible=!offscreen&&!document.hidden;});observer.observe(node);
    const visibility=()=>{visible=!document.hidden&&!offscreen;last=performance.now();};document.addEventListener('visibilitychange',visibility);
    const motion=()=>{if(media.matches){playing=false;setStopped(true);}goal(true);};media.addEventListener('change',motion);
    const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let downX=0,downY=0;
    function pick(e: PointerEvent){const r=node!.getBoundingClientRect();pointer.set((e.clientX-r.left)/width*2-1,-(e.clientY-r.top)/heightPx*2+1);raycaster.setFromCamera(pointer,camera3D);return raycaster.intersectObjects(stations.map(s=>s.group),true)[0]?.object.userData.station as StationId|undefined;}
    const down=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY;};
    const up=(e:PointerEvent)=>{if(Math.hypot(e.clientX-downX,e.clientY-downY)>6)return;const id=pick(e);if(id){localApi.focusStation(id);callbacks.current.onStation?.(id);}};
    const hover=(e:PointerEvent)=>{renderer.domElement.style.cursor=pick(e)?'pointer':'grab';};
    renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointermove',hover);
    const start=()=>{interacting=true;transitioning=false;};controls.addEventListener('start',start);
    const lostContext=(e:Event)=>{e.preventDefault();lost=true;setFailed(true);};
    const restored=()=>{lost=false;setFailed(false);last=performance.now();};
    renderer.domElement.addEventListener('webglcontextlost',lostContext);renderer.domElement.addEventListener('webglcontextrestored',restored);
    const point=new THREE.Vector3();let sentReady=false;
    function animate(now:number){
      raf=requestAnimationFrame(animate);const dt=Math.min(.04,Math.max(0,(now-(last||now))/1000));last=now;if(!visible||lost)return;
      if(playing){time+=dt;rotor.rotation.z+=dt*7;}
      const smooth=media.matches?1:1-Math.exp(-dt*6),spread=currentMode==='stations'?1:0;
      cutPlane.constant=THREE.MathUtils.lerp(cutPlane.constant,currentMode==='cutaway'?.85:10,smooth);
      environment.visible=currentMode!=='stations';
      stations.forEach((s,i)=>{const destination=s.base.clone();destination.x+=(i-2)*spread*.34;destination.y+=spread*.2;s.group.position.lerp(destination,smooth);});
      plume.visible=flowCurves[0].visible=flowCurves[1].visible=flowCurves[2].visible=ring.visible=currentMode==='airflow';
      for(let i=0;i<n;i++){
        const s=seeds[i],u=(s.phase+time*.12)%1;
        if(i<n*.4){
          intakeCurve.getPoint(u,point);const radius=.12*(1-u*.65);point.y+=Math.sin(s.angle+time*2)*s.radial*radius;point.z+=Math.cos(s.angle+time*1.3)*s.radial*radius;
          const clean=THREE.MathUtils.smoothstep(u,.35,.65);colors[i*3]=.62+clean*.13;colors[i*3+1]=.44+clean*.54;colors[i*3+2]=.26+clean*.61;
        }else{
          // Buoyant, expanding plume: analytic advection with two turbulent scales.
          const rise=u*2.65,rad=(.1+u*.55)*Math.sqrt(s.radial),swirl=s.angle+time*.45+u*5;
          point.set(2.6+Math.cos(swirl)*rad+u*u*.65,2.94+rise,1.2+Math.sin(swirl)*rad+Math.sin(u*7+time*.5)*u*.15);
          const fade=Math.sin(Math.PI*u);colors[i*3]=.58+fade*.3;colors[i*3+1]=.78+fade*.21;colors[i*3+2]=.7+fade*.24;
        }
        positions[i*3]=point.x;positions[i*3+1]=point.y;positions[i*3+2]=point.z;
      }
      particleGeometry.attributes.position.needsUpdate=true;particleGeometry.attributes.color.needsUpdate=true;
      if(currentCamera==='flight'&&playing&&!interacting){desiredPosition.set(Math.sin(time*.13+.65)*distance,distance*.53,Math.cos(time*.13+.65)*distance);desiredTarget.set(0,1,0);transitioning=true;}
      if(transitioning&&!interacting){camera3D.position.lerp(desiredPosition,smooth);controls.target.lerp(desiredTarget,smooth);if(currentCamera!=='flight'&&camera3D.position.distanceTo(desiredPosition)<.01)transitioning=false;}
      controls.update();renderer.render(scene,camera3D);
      if(!sentReady){sentReady=true;setReady(true);callbacks.current.onReady?.();}
    }
    raf=requestAnimationFrame(animate);
    return()=>{
      api.current=null;cancelAnimationFrame(raf);resizer.disconnect();observer.disconnect();controls.removeEventListener('start',start);controls.dispose();document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',motion);
      renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',up);renderer.domElement.removeEventListener('pointermove',hover);renderer.domElement.removeEventListener('webglcontextlost',lostContext);renderer.domElement.removeEventListener('webglcontextrestored',restored);
      const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
      scene.traverse(o=>{const m=o as THREE.Mesh;if(m.geometry)geometries.add(m.geometry);if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(mat=>{materials.add(mat);Object.values(mat).forEach(v=>{if(v instanceof THREE.Texture)textures.add(v);});});});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());env.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();
    };
    // Prop changes use the API; the GPU scene is constructed only once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embed]);

  const chooseMode=(next:MachineMode)=>{setMode(next);api.current?.setMode(next);};
  const chooseCamera=(next:MachineCamera)=>{setCamera(next);api.current?.setCamera(next);};
  const toggle=()=>{const next=!stopped;setStopped(next);if(next)api.current?.pause();else api.current?.play();callbacks.current.onPauseChange?.(next);};
  return <div ref={root} className={cn('agentic-factory-3d',embed&&'factory-embed',className)} style={{height} as CSSProperties}>
    <div ref={host} className="factory-stage" role="img" aria-label={t.label}/>
    {!ready&&!failed&&<p className="factory-loading">{t.loading}<span/></p>}
    {failed&&<div className="factory-fallback"><img src={`${import.meta.env.BASE_URL}images/plazion-prototype.webp`} alt={t.label}/><p>{t.fallback}</p></div>}
    {!embed&&<>
      <div className="factory-caption"><span className="factory-led"/>NTP / ESP <span>{t.hint}</span></div>
      <div className="factory-controls">
        <div className="factory-modes" role="group" aria-label={t.mode}>{modes.map((m,i)=>{const Icon=icons[i];return <button key={m} aria-pressed={mode===m} onClick={()=>chooseMode(m)}><Icon size={13}/>{t.modes[i]}</button>;})}</div>
        <div className="factory-cameras" role="group" aria-label={t.view}>{cameras.map((c,i)=><button key={c} aria-pressed={camera===c} onClick={()=>chooseCamera(c)}>{t.cameras[i]}</button>)}<button aria-label={t.reset} onClick={()=>{setSelected(null);chooseCamera('overview');}}><RotateCcw size={13}/></button><button aria-label={stopped?t.play:t.pause} aria-pressed={stopped} onClick={toggle}>{stopped?<Play size={13}/>:<Pause size={13}/>}</button></div>
      </div>
      {mode==='stations'&&<div className="factory-stations" role="group" aria-label={t.modes[2]}>{ids.map((id,i)=><button key={id} aria-pressed={selected===id} onClick={()=>{api.current?.focusStation(id);callbacks.current.onStation?.(id);}}><small>0{i+1}</small>{t.stations[i]}</button>)}</div>}
      {selected&&<div className="factory-tooltip" role="status"><strong>{t.stations[ids.indexOf(selected)]}</strong><p>{t.descriptions[ids.indexOf(selected)]}</p><button onClick={()=>{setSelected(null);chooseCamera('overview');}} aria-label={t.reset}>×</button></div>}
      <p className="factory-footnote">{t.illustration}</p>
    </>}
  </div>;
}
