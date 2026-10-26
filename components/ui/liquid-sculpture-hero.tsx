'use client';

// PLAZION-specific interpretation of the supplied liquid-particle hero.
// Analytic GPU advection, cursor wake and elastic return; no remote sculpture assets.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';
import { ArrowRight, Pause, Play, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import './liquid-sculpture-hero.css';

export interface SculptureHeroProps {
  className?: string; style?: CSSProperties; height?: number | string;
  language?: 'en' | 'ru' | 'uz'; paused?: boolean; onPauseChange?: (paused: boolean) => void;
  interactive?: boolean; strength?: number; radius?: number; particleDensity?: number;
  turbulence?: number; returnSpeed?: number; speed?: number; intro?: boolean;
  headline?: string; body?: string; background?: string;
}
const copy = {
  en: { eyebrow:'THE DIFFERENCE IS IN THE AIR',title:'From polluted air.\nTo a fresh beginning.',body:'Follow the flow through PLAZION. Move your cursor to stir the incoming particles and see the air settle into a cleaner stream.',input:'Incoming particles',treatment:'PLAZION',output:'Clean airflow',hint:'Move across the flow',pause:'Pause particles',play:'Resume particles',note:'Concept visualization of the treatment process.',fallback:'A visual journey from incoming particles through PLAZION to clean airflow.' },
  ru: { eyebrow:'РАЗНИЦА — В ВОЗДУХЕ',title:'От загрязнённого воздуха.\nК свежему началу.',body:'Проследите за потоком через PLAZION. Двигайте указатель, чтобы возмутить входящие частицы и увидеть, как воздух превращается в спокойный чистый поток.',input:'Входящие частицы',treatment:'PLAZION',output:'Чистый поток',hint:'Проведите по потоку',pause:'Приостановить частицы',play:'Возобновить частицы',note:'Концептуальная визуализация процесса очистки.',fallback:'Визуальный путь от входящих частиц через PLAZION к чистому потоку.' },
  uz: { eyebrow:'FARQ — HAVODA',title:'Ifloslangan havodan.\nToza kelajak sari.',body:'PLAZION orqali oqimni kuzating. Kiruvchi zarrachalarni harakatlantirish va havoning toza, sokin oqimga aylanishini ko‘rish uchun ko‘rsatkichni siljiting.',input:'Kiruvchi zarrachalar',treatment:'PLAZION',output:'Toza havo oqimi',hint:'Oqim bo‘ylab siljiting',pause:'Zarrachalarni to‘xtatish',play:'Zarrachalarni davom ettirish',note:'Tozalash jarayonining konseptual tasviri.',fallback:'Kiruvchi zarrachalardan PLAZION orqali toza oqimgacha bo‘lgan vizual yo‘l.' },
};
const vertex = `
attribute vec4 aSeed;
uniform float uTime; uniform float uPresence; uniform float uStrength; uniform float uRadius;
uniform float uTurbulence; uniform float uDpr; uniform vec2 uPointer;
varying vec3 vColor; varying float vAlpha;
void main(){
  float phase=fract(aSeed.x+uTime*(.035+aSeed.w*.01));
  float x=phase*20.0-10.0;
  float clean=smoothstep(-.8,.6,x);
  float band=(aSeed.y-.5)*3.8;
  float wave=sin(x*.6+aSeed.z*6.283+uTime*.7)*.35;
  float y=mix(band+wave,band*.43+sin(x*.85+uTime*.6+aSeed.z*.5)*.12,clean);
  y+=sin(x*2.5+uTime+aSeed.z*10.0)*.13*(1.0-clean)*uTurbulence;
  vec2 p=vec2(x,y);
  vec2 delta=p-uPointer;
  float field=exp(-dot(delta,delta)/(uRadius*uRadius))*uPresence;
  vec2 normal=delta/max(length(delta),.04);
  p+=(normal*.8+vec2(-normal.y,normal.x)*1.1)*field*uStrength;
  float edge=smoothstep(-10.0,-8.0,x)*(1.0-smoothstep(8.0,10.0,x));
  // Most incoming solids are captured; retained particles descend at the gate.
  float captured=step(.23,aSeed.z)*clean;
  p.y-=captured*max(0.0,x)*.4;
  vAlpha=edge*mix(.38,.55,clean)*(1.0-captured*.97);
  vColor=mix(vec3(.63,.48,.32),vec3(.73,.98,.87),clean);
  vec4 mv=modelViewMatrix*vec4(p.x,p.y,0.0,1.0);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=(mix(2.4,1.6,clean)+aSeed.w*1.8)*uDpr;
}`;
const fragment = `
varying vec3 vColor; varying float vAlpha;
void main(){float d=length(gl_PointCoord-.5)*2.0;float a=(1.0-smoothstep(.15,1.0,d))*vAlpha;if(a<.005)discard;gl_FragColor=vec4(vColor,a);}`;

export default function SculptureHero({ className, style, height=550, language='en', paused, onPauseChange, interactive=true, strength=1, radius=2.2, particleDensity=1, turbulence=1, returnSpeed=1, speed=1, intro=true, headline, body, background='#0d241c' }: SculptureHeroProps) {
  const [ownPaused,setOwnPaused]=useState(false);
  const effectivePaused=paused??ownPaused;
  const root=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null);
  const settings=useRef({paused:effectivePaused,interactive,strength,radius,turbulence,returnSpeed,speed});
  settings.current={paused:effectivePaused,interactive,strength,radius,turbulence,returnSpeed,speed};
  const [failed,setFailed]=useState(false);
  const t=copy[language];
  useEffect(()=>{
    const node=host.current,section=root.current;if(!node||!section)return;
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});}catch{setFailed(true);return;}
    const coarse=matchMedia('(pointer:coarse)').matches,media=matchMedia('(prefers-reduced-motion:reduce)');
    renderer.setPixelRatio(Math.min(devicePixelRatio,coarse?1.25:1.75));renderer.setClearColor(0,0);node.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-10,10,4,-4,.1,10);camera.position.z=3;
    const count=Math.round((coarse?7000:18000)*THREE.MathUtils.clamp(particleDensity,.15,2));
    const seeds=new Float32Array(count*4),positions=new Float32Array(count*3);
    for(let i=0;i<seeds.length;i++)seeds[i]=Math.random();
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,4));
    const material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,transparent:true,depthTest:false,depthWrite:false,uniforms:{uTime:{value:intro&&!media.matches?1:0},uPresence:{value:0},uStrength:{value:1},uRadius:{value:2.2},uTurbulence:{value:1},uDpr:{value:renderer.getPixelRatio()},uPointer:{value:new THREE.Vector2(-100,-100)}}});
    scene.add(new THREE.Points(geometry,material));
    let visible=true,offscreen=false,lost=false,time=0,last=0,raf=0,presence=0,targetPresence=0;
    const target=new THREE.Vector2(-100,-100),mouse=new THREE.Vector2(-100,-100);
    const resize=()=>{const w=node.clientWidth,h=node.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.top=10*h/w;camera.bottom=-camera.top;camera.updateProjectionMatrix();};
    const resizer=new ResizeObserver(resize);resizer.observe(node);resize();
    const observer=new IntersectionObserver(([e])=>{offscreen=!e.isIntersecting;visible=!offscreen&&!document.hidden;});observer.observe(section);
    const visibility=()=>{visible=!document.hidden&&!offscreen;last=performance.now();};document.addEventListener('visibilitychange',visibility);
    const move=(e:PointerEvent)=>{if(!settings.current.interactive||e.pointerType==='touch'&&e.buttons===0)return;const r=node.getBoundingClientRect();target.set((e.clientX-r.left)/r.width*20-10,(.5-(e.clientY-r.top)/r.height)*camera.top*2);if(mouse.x===-100)mouse.copy(target);targetPresence=1;};
    const leave=()=>{targetPresence=0;};
    section.addEventListener('pointermove',move,{passive:true});section.addEventListener('pointerdown',move,{passive:true});section.addEventListener('pointerleave',leave);section.addEventListener('pointerup',leave);section.addEventListener('pointercancel',leave);
    const contextLost=(e:Event)=>{e.preventDefault();lost=true;setFailed(true);};const restored=()=>{lost=false;setFailed(false);};
    renderer.domElement.addEventListener('webglcontextlost',contextLost);renderer.domElement.addEventListener('webglcontextrestored',restored);
    function frame(now:number){
      raf=requestAnimationFrame(frame);const dt=Math.max(0,Math.min(.035,(now-(last||now))/1000));last=now;if(!visible||lost)return;
      const options=settings.current;
      if(!options.paused&&!media.matches){time+=dt*THREE.MathUtils.clamp(options.speed,.25,3);mouse.lerp(target,1-Math.exp(-dt*8));presence+=(targetPresence-presence)*(1-Math.exp(-dt*(targetPresence?5:Math.max(.2,options.returnSpeed)*3)));}
      material.uniforms.uTime.value=time;material.uniforms.uPointer.value.copy(mouse);material.uniforms.uPresence.value=options.paused||media.matches?0:presence;
      material.uniforms.uStrength.value=THREE.MathUtils.clamp(options.strength,0,2);material.uniforms.uRadius.value=THREE.MathUtils.clamp(options.radius,.3,6);material.uniforms.uTurbulence.value=THREE.MathUtils.clamp(options.turbulence,0,2);
      renderer.render(scene,camera);
    }
    raf=requestAnimationFrame(frame);
    return()=>{cancelAnimationFrame(raf);resizer.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);section.removeEventListener('pointermove',move);section.removeEventListener('pointerdown',move);section.removeEventListener('pointerleave',leave);section.removeEventListener('pointerup',leave);section.removeEventListener('pointercancel',leave);renderer.domElement.removeEventListener('webglcontextlost',contextLost);renderer.domElement.removeEventListener('webglcontextrestored',restored);geometry.dispose();material.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
  },[particleDensity,intro]);
  return <section ref={root} className={cn('liquid-sculpture-hero',className)} style={{height,background,...style}} aria-labelledby="liquid-air-title">
    <div className="liquid-air-heading"><p>{t.eyebrow}</p><div className="liquid-air-tools"><span><Wind size={13}/>{t.hint}</span><button onClick={()=>{setOwnPaused(!effectivePaused);onPauseChange?.(!effectivePaused);}} aria-label={effectivePaused?t.play:t.pause} aria-pressed={effectivePaused}>{effectivePaused?<Play size={16}/>:<Pause size={16}/>}</button></div></div>
    <div ref={host} className="liquid-air-stage" role="img" aria-label={t.fallback}/>
    {failed&&<div className="liquid-air-fallback" role="img" aria-label={t.fallback}><span/><span/><span/><span/></div>}
    <div className="liquid-air-gate" aria-hidden="true"><i/><i/><i/><span>PL</span></div>
    <div className="liquid-air-labels" aria-hidden="true"><span>{t.input}</span><span>{t.treatment}</span><span>{t.output}<ArrowRight size={13}/></span></div>
    <div className="liquid-air-copy"><h2 id="liquid-air-title">{(headline||t.title).split('\n').map((line,i)=><span key={line} className={i===1?'liquid-air-accent':undefined}>{line}</span>)}</h2><div><p>{body||t.body}</p><small>{t.note}</small></div></div>
  </section>;
}
