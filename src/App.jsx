import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, ArrowUp, Wind, Sun, Moon, Globe2, Menu, X, Play, Pause, Check, Download, ShieldCheck, Layers3, Leaf, MapPin, Cpu, Factory, UtensilsCrossed, CircleCheck, ExternalLink, Plus } from 'lucide-react';
import { content, languages, formatPrice } from './content.js';
import { ReactorArt, HybridArt, SensorArt } from './EquipmentArt.jsx';
import { projectAuthor } from './project.js';

const navigation = [['technology', '#technology'], ['equipment', '#equipment'], ['business', '#business'], ['specs', '#specifications'], ['about', '#about']];
const motionLabels = { ru: ['Приостановить анимацию', 'Включить анимацию'], en: ['Pause animations', 'Play animations'], uz: ['Animatsiyani to‘xtatish', 'Animatsiyani yoqish'] };

function savePreference(key, value) {
  try { localStorage.setItem(`plazion-${key}`, value); } catch { /* Preferences are optional in private browsing. */ }
}

function Logo({ footer = false }) {
  return <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#home" aria-label="PLazion">
    <span className="brand-image"><img src={`${import.meta.env.BASE_URL}images/plazion.png`} alt="" width="1254" height="1254" /></span>
    <span>PLazion<span className="brand-dot">.</span></span>
  </a>;
}

function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span />{children}</p>;
}

function Reveal({ as: Tag = 'div', className = '', children, delay = 0, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node?.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('is-visible'); observer.unobserve(node); }
    }, { threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref} data-reveal className={className} style={{ '--reveal-delay': `${delay}ms` }} {...props}>{children}</Tag>;
}

function Header({ t, language, setLanguage, theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef(null);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => { if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    window.addEventListener('keydown', close);
    const query = matchMedia('(min-width: 1025px)');
    const onResize = (e) => { if (e.matches) setMenuOpen(false); };
    query.addEventListener('change', onResize);
    return () => { window.removeEventListener('keydown', close); query.removeEventListener('change', onResize); };
  }, [menuOpen]);
  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="container header-inner">
      <Logo />
      <nav className="desktop-nav" aria-label={t.ui.explore}>
        {navigation.map(([key, href]) => <a href={href} key={key}>{t.nav[key]}</a>)}
      </nav>
      <div className="header-tools">
        <label className="language-picker"><Globe2 size={16} aria-hidden="true" /><span className="sr-only">{t.ui.language}</span><select aria-label={t.ui.language} value={language} onChange={(e) => setLanguage(e.target.value)}>{languages.map((item) => <option value={item.code} key={item.code} lang={item.code}>{item.short} · {item.label}</option>)}</select></label>
        <button className="icon-button theme-toggle" aria-label={theme === 'light' ? t.ui.dark : t.ui.light} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
        <a className="button button-small button-dark header-contact" href="#contact">{t.nav.contact}<ArrowUpRight size={16} /></a>
        <button ref={menuButton} className="icon-button mobile-menu-button" aria-label={menuOpen ? t.ui.closeMenu : t.ui.menu} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" hidden={!menuOpen} aria-label={t.ui.menu}>
      {navigation.map(([key, href]) => <a key={key} href={href} onClick={() => setMenuOpen(false)}>{t.nav[key]}<ArrowUpRight size={18} /></a>)}
      <a href="#contact" onClick={() => setMenuOpen(false)}>{t.nav.contact}<ArrowUpRight size={18} /></a>
    </nav>
  </header>;
}

function Hero({ t, language, openVideo, paused, setPaused }) {
  return <section className="hero container" id="home">
    <div className="hero-content">
      <h1><span>{t.hero.line1}</span><span className="hero-accent">{t.hero.line2}<svg viewBox="0 0 440 15" preserveAspectRatio="none" aria-hidden="true"><path d="M3 11C123 0 304-1 436 9" /></svg></span></h1>
      <p className="hero-description">{t.hero.description}</p>
      <div className="hero-actions"><a href="#technology" className="button button-dark">{t.hero.primary}<ArrowUpRight size={19} /></a><button className="video-button" onClick={openVideo}><span className="play-circle"><Play size={13} fill="currentColor" /></span>{t.hero.secondary}</button></div>
      <p className="hero-note"><Leaf size={15} />{t.hero.note}</p>
    </div>
    <div className="hero-visual">
      <div className="visual-grid" />
      <div className="visual-topline"><span><span className="live-dot" />{t.hero.graphicLabel}</span><span className="mono">PL—01 / 2026</span></div>
      <div className="hero-art"><ReactorArt /></div>
      <div className="air-label air-label-in"><span className="air-label-icon"><Wind size={16} /></span><span>{t.hero.incomingAir}</span><span className="air-label-line" /></div>
      <div className="air-label air-label-out"><span className="air-label-line" /><span>{t.hero.cleanAir}</span><ArrowUpRight size={15} /></div>
      <div className="efficiency-badge"><span className="efficiency-icon"><CircleCheck size={22} strokeWidth={1.4} /></span><div><span>{t.hero.efficiency}</span><strong>{t.hero.efficiencyValue}</strong></div><svg className="mini-chart" viewBox="0 0 55 35" aria-hidden="true"><path d="M2 30 13 22l9 3L33 9l8 5L53 2" /></svg></div>
      <div className="visual-bottomline"><div><span className="mono">GL-JD-6A</span><span>{t.hero.systemLabel}</span></div><button className="icon-button motion-toggle" aria-label={motionLabels[language][paused ? 1 : 0]} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button></div>
    </div>
    <a className="hero-scroll" href="#overview"><span className="scroll-line" />{t.hero.scroll}<ArrowDown size={14} /></a>
  </section>;
}

function Stats({ t }) {
  return <div className="stats-wrap"><div className="stats container">{t.stats.map((stat, i) => <Reveal key={i} delay={i * 70} className="stat"><div className="stat-number">{stat.value}<span>{stat.suffix}</span></div><p>{stat.label}</p></Reveal>)}</div></div>;
}

function Overview({ t }) {
  const icons = [ShieldCheck, Leaf, ShieldCheck];
  return <section className="overview section-space container" id="overview">
    <Reveal className="overview-heading"><Eyebrow>{t.intro.eyebrow}</Eyebrow><h2>{t.intro.title}</h2><p className="section-description">{t.intro.description}</p><div className="application-tags">{t.intro.applications.map((label, i) => { const Icon = [UtensilsCrossed, Factory, Cpu][i]; return <span key={label}><Icon size={15} strokeWidth={1.4} />{label}</span>; })}</div></Reveal>
    <div className="feature-list">{t.intro.features.map((feature, i) => { const Icon = icons[i]; return <Reveal className="feature-row" key={i} delay={i * 70}><span className="feature-icon"><Icon size={23} strokeWidth={1.4} /></span><div><h3>{feature.title}</h3><p>{feature.description}</p></div><span className="feature-index">0{i + 1}</span></Reveal>; })}</div>
  </section>;
}

function FiltrationDiagram({ active, t }) {
  return <div className="filtration-diagram" aria-label={t.process.diagram} role="img">
    <div className="diagram-flow-label"><span>{t.process.input}</span><ArrowRight size={15} /><span>{t.process.output}</span></div>
    <div className="diagram-scene">
      <div className="diagram-rail rail-top" /><div className="diagram-rail rail-bottom" />
      <div className="diagram-streams">{Array.from({ length: 5 }, (_, i) => <span key={i} style={{ '--stream-index': i }} />)}</div>
      <div className="diagram-dust">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--particle-index': i }} />)}</div>
      {[0, 1, 2, 3].map((step) => <div key={step} className={`diagram-module module-${step} ${active === step ? 'module-active' : ''}`}><div className="module-top" /><div className="module-side" /><div className="module-face">{step === 0 ? <div className="module-mesh" /> : step === 1 ? <div className="ionization-lines">{[0, 1, 2, 3, 4].map((n) => <span key={n}><Plus size={9} /></span>)}</div> : step === 2 ? <div className="collection-plates">{[0, 1, 2, 3, 4, 5, 6].map((n) => <span key={n} />)}</div> : <Wind size={44} strokeWidth={.8} />}</div><span className="module-number">0{step + 1}</span></div>)}
    </div>
    <div className="diagram-caption"><span className="live-dot" /><span>{t.process.stages[active].detail}</span></div>
  </div>;
}

function Technology({ t }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const handleKeys = (event, index) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % 4;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + 3) % 4;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 3;
    if (next !== undefined) { event.preventDefault(); setActive(next); tabRefs.current[next]?.focus(); }
  };
  return <section className="technology" id="technology"><div className="container section-space">
    <Reveal className="technology-heading"><div><Eyebrow light>{t.process.eyebrow}</Eyebrow><h2>{t.process.title}</h2></div><p className="section-description">{t.process.description}</p></Reveal>
    <Reveal className="process-tabs" role="tablist" aria-label={t.process.diagram}>{t.process.stages.map((stage, i) => <button key={i} ref={(node) => { tabRefs.current[i] = node; }} role="tab" id={`stage-tab-${i}`} aria-controls="stage-panel" aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={(e) => handleKeys(e, i)}><span className="step-index">{stage.symbol}</span><span>{stage.short}</span><ArrowUpRight size={17} /></button>)}</Reveal>
    <Reveal className="process-body"><FiltrationDiagram t={t} active={active} /><div className="stage-panel" id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${active}`} tabIndex={0}><span className="stage-count">{t.process.stage} / 0{active + 1}</span><div key={active} className="stage-panel-copy"><h3>{t.process.stages[active].title}</h3><p>{t.process.stages[active].description}</p><div className="stage-detail"><Check size={15} />{t.process.stages[active].detail}</div></div></div></Reveal>
    <p className="technology-footnote">{t.process.footnote}</p>
  </div></section>;
}

function ProductArt({ id }) {
  return id === 'gl-jd-6a' ? <ReactorArt compact /> : id === 'hybrid' ? <HybridArt /> : <SensorArt />;
}

function Catalog({ t, language, openProduct }) {
  const [filter, setFilter] = useState('all');
  const products = t.catalog.products.filter((product) => filter === 'all' || product.category === filter);
  return <section className="catalog section-space container" id="equipment">
    <Reveal className="section-heading"><div><Eyebrow>{t.catalog.eyebrow}</Eyebrow><h2>{t.catalog.title}</h2></div><p className="section-description">{t.catalog.description}</p></Reveal>
    <div className="catalog-toolbar"><div className="catalog-filters" role="group" aria-label={t.ui.filterLabel}>{['all', 'main', 'monitoring'].map((item) => <button key={item} className={filter === item ? 'selected' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)}>{t.catalog[item]}{item === 'all' && <span>03</span>}</button>)}</div><span className="catalog-count mono" aria-live="polite">0{products.length} / 03</span></div>
    <div className="product-grid">{products.map((product) => <article key={product.id} className="product">
      <button className={`product-image product-image-${product.id}`} onClick={() => openProduct(product.id)} aria-label={`${t.ui.details}: ${product.name}`}><span className="product-image-label">{product.id === 'gl-jd-6a' ? <><span className="live-dot" />{t.catalog.available}</> : product.model}</span><ProductArt id={product.id} /><span className="product-image-arrow"><ArrowUpRight size={21} /></span><span className="product-illustration-label">{t.ui.illustrative}</span></button>
      <div className="product-type">{product.type}</div><h3>{product.name}</h3><span className="product-model mono">{product.model}</span><p className="product-description">{product.description}</p><div className="product-tags">{product.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="product-bottom"><div><span>{t.ui.price}</span><p>{formatPrice(product.price, language)} <small>{t.ui.currency}</small></p></div><button className="product-details-button" onClick={() => openProduct(product.id)} aria-label={`${t.ui.details}: ${product.name}`}><ArrowUpRight size={20} /></button></div>
    </article>)}</div>
    <p className="catalog-footnote">{t.catalog.priceNote}</p>
  </section>;
}

function Business({ t }) {
  return <section className="business" id="business"><div className="container business-layout">
    <Reveal className="business-copy"><Eyebrow>{t.business.eyebrow}</Eyebrow><h2>{t.business.title}</h2><p>{t.business.description}</p><a className="business-cta" href={`mailto:${projectAuthor.email}?subject=${encodeURIComponent(t.business.emailSubject)}`}>{t.business.cta}<ArrowUpRight size={19} /></a></Reveal>
    <Reveal className="business-pricing"><span className="business-label"><span className="live-dot" />{t.business.label}</span><div className="business-price"><span>$</span>25<small>{t.business.period}</small></div><h3>{t.business.plan}</h3><p>{t.business.currency}</p></Reveal>
  </div></section>;
}

function Specifications({ t, onDownload }) {
  return <section className="specifications" id="specifications"><div className="container section-space specs-layout">
    <Reveal className="specs-intro"><Eyebrow>{t.specs.eyebrow}</Eyebrow><h2>{t.specs.title}</h2><p className="section-description">{t.specs.description}</p><button className="text-button" onClick={onDownload}>{t.ui.download}<Download size={17} /></button><div className="specs-stamp" aria-hidden="true"><Wind size={42} strokeWidth={.8} /><span>PLazion</span><small>ENGINEERED TO BREATHE</small></div></Reveal>
    <Reveal className="specs-table-wrap"><div className="specs-table-header"><span className="live-dot" /><span>{t.specs.badge}</span><span className="mono">GL-JD-6A</span></div><table className="specs-table"><thead className="sr-only"><tr><th scope="col">{t.ui.specification}</th><th scope="col">{t.ui.value}</th></tr></thead><tbody>{t.specs.rows.map(([name, value]) => <tr key={name}><th scope="row">{name}</th><td>{value}</td></tr>)}</tbody></table><p className="specs-note">{t.specs.note}</p></Reveal>
  </div></section>;
}

function Contact({ t }) {
  return <section className="contact section-space container" id="about">
    <Reveal className="contact-heading" id="contact"><Eyebrow>{t.contact.eyebrow}</Eyebrow><h2>{t.contact.title}<span className="contact-asterisk" aria-hidden="true">✳</span></h2><p className="section-description">{t.contact.description}</p><a className="contact-email" href={`mailto:${projectAuthor.email}`}>{projectAuthor.email}<ArrowUpRight size={22} /></a></Reveal>
    <Reveal className="contact-details"><div className="person"><span className="person-avatar">BE</span><div><p>{t.contact.authorLabel}</p><h3>{projectAuthor.name}</h3></div></div><div className="person"><span className="person-avatar">ББ</span><div><p>{t.contact.supervisorLabel}</p><h3>{t.contact.supervisor}</h3></div></div><div className="contact-address"><MapPin size={20} strokeWidth={1.4} /><div><p>{t.contact.locationLabel}</p><h3>{t.contact.address}</h3><a href="https://www.google.com/maps/search/?api=1&query=39+Kary-Niyazi+Street+Tashkent" target="_blank" rel="noreferrer">{t.contact.map}<ArrowUpRight size={14} /></a></div></div></Reveal>
    <Reveal className="partners"><span className="partners-label">{t.ui.partners}</span><div>{t.contact.partnerNames.map((name, i) => { const Icon = [Layers3, Leaf, Factory][i]; return <span key={name} className="partner"><Icon size={24} strokeWidth={1.4} /><span>{name}</span></span>; })}</div></Reveal>
  </section>;
}

function Modal({ title, onClose, children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('.modal-close')?.focus({ preventScroll: true });
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = oldOverflow; };
  }, []);
  return <dialog ref={ref} className={`modal ${className}`} onClose={onClose} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="modal-title"><div className="modal-inner">{children}<button className="icon-button modal-close" aria-label={title} onClick={onClose}><X size={22} /></button></div></dialog>;
}

export default function App() {
  const [language, setLanguage] = useState(() => ['ru', 'en', 'uz'].includes(document.documentElement.lang) ? document.documentElement.lang : 'ru');
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [videoOpen, setVideoOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [toast, setToast] = useState(false);
  const t = content[language];
  const product = t.catalog.products.find((item) => item.id === productId);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]').setAttribute('content', t.meta.description);
    savePreference('language', language);
  }, [language, t]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#131a15' : '#f7f8f2');
    savePreference('theme', theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? 'paused' : 'playing';
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => setPaused(event.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [paused]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const downloadSpecs = () => {
    const text = `PLazion — GL-JD-6A\n${t.specs.badge}\n\n${t.specs.rows.map(([name, value]) => `${name}: ${value}`).join('\n')}\n\n${t.specs.note}\n\n${t.contact.authorLabel}: ${projectAuthor.name}\n${projectAuthor.email}\n${t.contact.supervisorLabel}: ${t.contact.supervisor}\n${t.contact.address}\n`;
    const url = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `PLazion-GL-JD-6A-${language}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast(true);
  };

  return <>
    <a className="skip-link" href="#main-content">{t.ui.skip}</a>
    <Header t={t} language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />
    <main id="main-content">
      <Hero t={t} language={language} openVideo={() => setVideoOpen(true)} paused={paused} setPaused={setPaused} />
      <Stats t={t} />
      <Overview t={t} />
      <Technology t={t} />
      <Catalog t={t} language={language} openProduct={setProductId} />
      <Business t={t} />
      <Specifications t={t} onDownload={downloadSpecs} />
      <Contact t={t} />
    </main>
    <footer className="footer"><div className="container"><div className="footer-top"><div><Logo footer /><p>{t.contact.footer}</p></div><a className="back-top" href="#home">{t.ui.back}<span><ArrowUp size={19} /></span></a></div><div className="footer-bottom"><p>© {new Date().getFullYear()} PLazion. {t.ui.rights}</p><span>{t.contact.made}</span><span className="footer-status"><span className="live-dot" />TASHKENT, UZ</span></div></div></footer>
    {videoOpen && <Modal title={t.ui.close} onClose={() => setVideoOpen(false)} className="video-modal"><h2 id="modal-title">{t.ui.videoTitle}</h2><div className="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/98F_5gJnnig?autoplay=1" title={t.ui.videoTitle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div><div className="video-modal-bottom"><p>{t.ui.videoNote}</p><a href="https://www.youtube.com/watch?v=98F_5gJnnig" target="_blank" rel="noreferrer">{t.ui.externalVideo}<ExternalLink size={15} /></a></div></Modal>}
    {product && <Modal title={t.ui.close} onClose={() => setProductId(null)} className="product-modal"><div className="modal-product-art"><ProductArt id={product.id} /><span>{t.ui.illustrative}</span></div><div className="modal-product-content"><p className="product-type">{product.type}</p><h2 id="modal-title">{product.name}</h2><span className="product-model mono">{product.model}</span><p>{product.description}</p><ul>{product.details.map((detail) => <li key={detail}><Check size={16} />{detail}</li>)}</ul><div className="modal-product-price">{formatPrice(product.price, language)} <small>{t.ui.currency}</small></div><p className="modal-price-note">{t.catalog.priceNote}</p><a className="button button-dark" href="#contact" onClick={() => setProductId(null)}>{t.catalog.inquire}<ArrowUpRight size={17} /></a></div></Modal>}
    <div className={`toast ${toast ? 'toast-visible' : ''}`} role="status" aria-live="polite">{toast && <><CircleCheck size={18} />{t.ui.downloaded}</>}</div>
  </>;
}
