import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Briefcase, Code2, Github, GraduationCap,
  Instagram, Linkedin, Menu, Phone, Send, SkipBack, SkipForward, Terminal as TerminalIcon, Volume2, VolumeX, X,
} from 'lucide-react';
import OrbitalWorld from './OrbitalWorld';

const cut = 'polygon(0 0,calc(100% - 26px) 0,100% 26px,100% calc(100% - 16px),calc(100% - 16px) 100%,26px 100%,0 calc(100% - 26px))';
const stations = [
  { id: 'entry', code: '00', label: 'ENTRY', signal: 'THE GATE IS OPEN' },
  { id: 'featured', code: '01', label: 'WORK', signal: 'PROOF BEFORE PROMISE' },
  { id: 'profile', code: '02', label: 'PROFILE', signal: 'OPERATOR IDENTIFIED' },
  { id: 'skills', code: '03', label: 'STACK', signal: 'CAPABILITY ARRAY' },
  { id: 'experience', code: '04', label: 'LOG', signal: 'TEN YEARS IN MOTION' },
  { id: 'projects', code: '05', label: 'ARCHIVE', signal: 'PUBLIC NETWORK ONLINE' },
  { id: 'contact', code: '06', label: 'UPLINK', signal: 'TRANSMISSION READY' },
];

function BootSequence({ done }) {
  const [step, setStep] = useState(0);
  const ready = step >= 5;
  const lines = ['ESTABLISH ORBITAL LINK', 'SYNC AUTONOMOUS CORE', 'MAP ENGINEERING ARCHIVE', 'VERIFY OPERATOR', 'OPEN VISITOR CHANNEL'];
  useEffect(() => {
    const id = setInterval(() => setStep((value) => {
      if (value >= lines.length) { clearInterval(id); return value; }
      return value + 1;
    }), 210);
    return () => clearInterval(id);
  }, [done]);
  return <motion.div className="boot" exit={{ opacity: 0 }}>
    <div className="boot__inner">
      <div className="boot__logo">MER<span>23</span>LIN</div>
      <div className="boot__readout">ORBITAL INTERFACE // FLIGHT PREPARATION</div>
      {lines.map((line, index) => <p key={line} className={index < step ? 'is-ready' : ''}><b>0{index + 1}</b>{line}<span>{index < step ? 'ONLINE' : 'WAIT'}</span></p>)}
      <div className="boot__bar"><i style={{ width: `${step / lines.length * 100}%` }} /></div>
      {ready ? <div className="boot__entry" role="dialog" aria-modal="true" aria-label="Choose how to enter the portfolio"><b>SYSTEM READY</b><p>CHOOSE YOUR AUDIO MODE</p><div className="boot__actions"><button type="button" onClick={() => { window.dispatchEvent(new Event('mer23lin:enter')); done(); }}><Volume2 /> ENTER WITH SOUND</button><button className="is-muted" type="button" onClick={done}><VolumeX /> ENTER WITHOUT SOUND</button></div></div> : <small>INITIALIZING VISITOR CHANNEL...</small>}
    </div>
  </motion.div>;
}

function World({ active, reduced, travel, mobile }) {
  return <OrbitalWorld active={active} reduced={reduced} travel={travel} mobile={mobile} />;
}

function CyberAudioToggle() {
  const audio = useRef(null);
  const cacheName = 'mer23lin-audio-v1';
  const tracks = [
    { id: '1', label: 'TRACK 01', src: '/audio/1.mp3' },
    { id: '2', label: 'TRACK 02', src: '/audio/2.mp3' },
    { id: '3', label: 'TRACK 03', src: '/audio/3.mp3' },
  ];
  const [enabled, setEnabled] = useState(false);
  const [track, setTrack] = useState(() => tracks[Math.floor(Math.random() * tracks.length)].id);
  const selected = tracks.find((item) => item.id === track) || tracks[0];
  const cacheTrack = async (src) => {
    const cache = 'caches' in window ? await caches.open(cacheName) : null;
    if (!cache || await cache.match(src)) return;
    const response = await fetch(src, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Audio unavailable: ${response.status}`);
    await cache.put(src, response);
  };
  const stopAudio = () => { audio.current?.pause(); setEnabled(false); };
  const startAudio = async (nextTrack = selected) => {
    if (!audio.current) audio.current = new Audio();
    const player = audio.current;
    if (!player.src || player.dataset.track !== nextTrack.id) {
      player.pause();
      player.src = nextTrack.src;
      player.dataset.track = nextTrack.id;
      player.loop = true;
      player.volume = .18;
    }
    await player.play();
    setEnabled(true);
    cacheTrack(nextTrack.src).catch(() => {});
  };
  const changeTrack = (direction) => {
    const currentIndex = tracks.findIndex((item) => item.id === selected.id);
    const nextTrack = tracks[(currentIndex + direction + tracks.length) % tracks.length];
    setTrack(nextTrack.id);
    localStorage.setItem('mer23lin-track', nextTrack.id);
    setEnabled(false);
    startAudio(nextTrack).catch(() => setEnabled(false));
  };
  useEffect(() => {
    const enterWithSound = () => startAudio().catch(() => setEnabled(false));
    const stopWhenHidden = () => { if (document.hidden) stopAudio(); };
    addEventListener('mer23lin:enter', enterWithSound);
    document.addEventListener('visibilitychange', stopWhenHidden);
    addEventListener('pagehide', stopAudio);
    return () => {
      removeEventListener('mer23lin:enter', enterWithSound);
      document.removeEventListener('visibilitychange', stopWhenHidden);
      removeEventListener('pagehide', stopAudio);
      audio.current?.pause();
    };
  }, []);
  const toggle = () => { if (enabled) stopAudio(); else startAudio().catch(() => setEnabled(false)); };
  return <div className="audio-controls"><button className="audio-skip" type="button" onClick={() => changeTrack(-1)} aria-label="Previous background track"><SkipBack /></button><button className={`audio-toggle ${enabled ? 'is-on' : ''}`} type="button" onClick={toggle} aria-pressed={enabled} aria-label={enabled ? 'Turn background music off' : 'Turn background music on'}>{enabled ? <Volume2 /> : <VolumeX />}<span>{selected.label}{enabled ? '' : ' · OFF'}</span></button><button className="audio-skip" type="button" onClick={() => changeTrack(1)} aria-label="Next background track"><SkipForward /></button></div>;
}

function Hud({ active, menu, setMenu, navigate, cityProgress }) {
  const station = stations[active];
  const travelTo = (event, index) => {
    event.preventDefault();
    navigate(index);
    setMenu(false);
  };
  return <>
    <header className="hud-top">
      <a href="#entry" className="mark" onClick={(event) => { event.preventDefault(); navigate(0); }}>MER<span>23</span>LIN<small>INDEPENDENT ENGINEERING / EST. 2016</small></a>
      <div className="telemetry"><i /> ORBITAL LINK ACTIVE <span>{station.signal} // KM-{String(Math.round(cityProgress * 4200)).padStart(4, '0')}</span></div>
      <CyberAudioToggle />
      <button className="hud-menu-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'}>{menu ? <X /> : <Menu />}</button>
    </header>
    <nav className={`rail ${menu ? 'is-open' : ''}`} aria-label="Portfolio sections">
      {stations.map((item, i) => <a key={item.id} href={`#${item.id}`} aria-current={active === i ? 'page' : undefined} aria-label={`${item.code} ${item.label}`} className={active === i ? 'active' : ''} onClick={(event) => travelTo(event, i)}><b>{item.label}</b><span>{item.code}</span></a>)}
    </nav>
    <div className="hud-corners" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="flight-deck" aria-live="polite">
      <div className="flight-deck__station"><small>CURRENT STATION</small><b>{station.code} // {station.label}</b></div>
      <button className="flight-deck__step" onClick={() => navigate(active - 1)} disabled={active === 0} aria-label="Previous station"><ArrowLeft /></button>
      <div className="flight-deck__route" role="progressbar" aria-label="City journey progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(cityProgress * 100)} style={{ '--route-progress': cityProgress }}><span className="flight-deck__runner" style={{ left: `calc(${cityProgress * 100}% + ${9 * (1 - 2 * cityProgress)}px)` }} />{stations.map((item, index) => <button key={item.id} className={index === active ? 'active' : index < active ? 'passed' : ''} onClick={() => navigate(index)} aria-label={`Open ${item.label}`} />)}</div>
      <div className="flight-deck__percent">{String(Math.round(cityProgress * 100)).padStart(2, '0')}%<small>NODE {String(active + 1).padStart(2, '0')} / {String(stations.length).padStart(2, '0')}</small></div>
      <button className="flight-deck__step" onClick={() => navigate(active + 1)} disabled={active === stations.length - 1} aria-label="Next station"><ArrowRight /></button>
      <div className="flight-deck__keys">SCROLL: PANEL → EDGE → SNAP DRIVE</div>
    </div>
  </>;
}

function CursorSignal() {
  const ref = useRef();
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return undefined;
    const move = (event) => {
      if (!ref.current) return;
      ref.current.style.setProperty('--x', `${event.clientX}px`);
      ref.current.style.setProperty('--y', `${event.clientY}px`);
      ref.current.classList.toggle('is-link', Boolean(event.target.closest('a,button,input')));
    };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  }, []);
  return <div className="cursor-signal" ref={ref} aria-hidden="true"><i /><span /></div>;
}

function Section({ id, index, eyebrow, title, side = 'left', children, className = '', active = false, direction = 1 }) {
  const reduceMotion = useReducedMotion();
  const mobile = matchMedia('(max-width: 760px)').matches;
  const screenColors = ['#00eaff', '#ff24c8', '#00eaff', '#9b6cff', '#00eaff', '#ff24c8', '#00eaff'];
  const panel = <div className="screen-dock console-window">
    <div className="screen-hardware" aria-hidden="true"><i /><i /><i /><b>DISPLAY M23-{String(index).padStart(2, '0')}</b><span>◈</span></div>
    <div className="chapter__panel">
      <div className="chapter__meta"><span>CHAPTER // 0{index}</span><b>{eyebrow}</b></div>
      {title && <h2>{title}</h2>}{children}
    </div>
    <div className="screen-bus" aria-hidden="true"><i /><i /><i /><i /><span /></div>
  </div>;
  if (mobile) return active ? <section id={id} className={`chapter chapter--${side} ${className} is-console-active mobile-static-section`} data-index={index} style={{ '--screen': screenColors[index] }}>{panel}</section> : null;
  const variants = reduceMotion || mobile ? { enter: { opacity: 1 }, center: { opacity: 1 }, exit: { opacity: 0 } } : {
    enter: (way) => ({ opacity: 0, scale: .72, rotateY: way * -12, x: way * 170, filter: 'blur(14px)' }),
    center: { opacity: 1, scale: 1, rotateY: 0, x: 0, filter: 'blur(0px)' },
    exit: (way) => ({ opacity: 0, scale: 1.16, rotateY: way * 8, x: way * -120, filter: 'blur(12px)' }),
  };
  return <AnimatePresence mode="sync" custom={direction}>{active && <motion.section key={id} id={id} className={`chapter chapter--${side} ${className} is-console-active`} data-index={index} style={{ '--screen': screenColors[index] }} custom={direction} variants={variants} initial={mobile ? false : 'enter'} animate="center" exit="exit" transition={{ type: 'spring', stiffness: 145, damping: 24, mass: .72, opacity: { duration: .24 }, filter: { duration: .3 } }}>
    {panel}
  </motion.section>}</AnimatePresence>;
}

function Featured({ items }) {
  const [selected, setSelected] = useState(0);
  const item = items[selected];
  return <div className="case-console" style={{ '--case-accent': item.accent }}>
    <div className="case-tabs">{items.map((project, i) => <button key={project.id} className={i === selected ? 'active' : ''} onClick={() => setSelected(i)}><span>0{i + 1}</span>{project.title}</button>)}</div>
    <AnimatePresence mode="wait"><motion.article key={item.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
      <div className="case-title"><span>{item.category}</span><h3>{item.title}</h3><strong>{item.proof}</strong></div>
      <div className="case-blueprint" aria-label="Engineering workflow"><span>01 / DEFINE<br /><b>Problem & constraints</b></span><ArrowRight /><span>02 / ENGINEER<br /><b>{item.stack[0]} architecture</b></span><ArrowRight /><span>03 / DELIVER<br /><b>Inspectable implementation</b></span></div>
      <div className="case-grid"><div><small>THE CHALLENGE</small><p>{item.problem}</p></div><div><small>THE APPROACH</small><p>{item.solution}</p></div><div><small>MY CONTRIBUTION</small><p>{item.role}</p></div><div><small>THE OUTCOME</small><p>{item.result}</p></div></div>
      <div className="case-bottom"><div>{item.stack.map(tag => <span key={tag}>{tag}</span>)}</div><a href={item.url} target="_blank" rel="noreferrer">INSPECT CASE <ArrowUpRight /></a></div>
    </motion.article></AnimatePresence>
  </div>;
}

function Terminal({ open, close, projects }) {
  const [value, setValue] = useState('');
  const [lines, setLines] = useState(['MER23LIN VISITOR TERMINAL READY', 'TYPE: help']);
  const submit = (event) => {
    event.preventDefault(); const command = value.trim().toLowerCase();
    const map = { help:'about · work · stack · contact · clear', about:'AMIRREZA GHAFFARIAN // AI AGENT ENGINEER + FULL-STACK DEVELOPER', work:`${projects.length} PUBLIC NODES // 5 FEATURED CASES`, stack:'REACT · NEXT.JS · TYPESCRIPT · ANGULAR · PYTHON · MONGODB · POSTGRESQL · THREE.JS', contact:'TEL +98 915 238 9023 // TELEGRAM @ARGHN23' };
    setLines(command === 'clear' ? [] : [...lines, `> ${value}`, map[command] || `UNKNOWN SIGNAL: ${command || '[EMPTY]'}`]); setValue('');
  };
  return <AnimatePresence>{open && <motion.div className="terminal" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} role="dialog" aria-label="MER23LIN terminal">
    <div className="terminal__bar"><span>VISITOR://TERMINAL</span><button onClick={close}>×</button></div><div className="terminal__lines">{lines.map((line,i)=><p key={`${line}-${i}`}>{line}</p>)}</div>
    <form onSubmit={submit}><b>Ω</b><input autoFocus value={value} onChange={e=>setValue(e.target.value)} aria-label="Terminal command" /></form>
  </motion.div>}</AnimatePresence>;
}

export default function PortfolioExperience({ projects, featuredProjects, skillGroups, experience, manifestoText }) {
  const [scenePaused, setScenePaused] = useState(false);
  const [language, setLanguage] = useState('All'), [brief, setBrief] = useState('AI & automation');
  const [booted, setBooted] = useState(false), [menu, setMenu] = useState(false), [terminal, setTerminal] = useState(false), [query, setQuery] = useState(''), [active, setActive] = useState(0), [direction, setDirection] = useState(1), [cityProgress, setCityProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(() => matchMedia('(max-width: 760px)').matches);
  const activeRef = useRef(0), travelRef = useRef(0), touchStart = useRef(null), snapTimer = useRef(null), routeTarget = useRef(null), scrollAnimation = useRef(null), wheelIntent = useRef(0), wheelResetTimer = useRef(null); const reduced = useReducedMotion();
  const filtered = projects.filter(p => (language === 'All' || p.language === language) && `${p.title} ${p.type} ${p.language} ${p.description}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const media = matchMedia('(max-width: 760px)');
    const syncMobile = () => setIsMobile(media.matches);
    document.documentElement.classList.toggle('firefox-mobile', /Firefox/i.test(navigator.userAgent) && media.matches);
    if (media.addEventListener) media.addEventListener('change', syncMobile); else media.addListener(syncMobile);
    return () => {
      document.documentElement.classList.remove('firefox-mobile');
      if (media.removeEventListener) media.removeEventListener('change', syncMobile); else media.removeListener(syncMobile);
    };
  }, []);
  const setStation = (bounded) => {
    if (bounded === activeRef.current) return;
    setDirection(bounded > activeRef.current ? 1 : -1);
    activeRef.current = bounded;
    setActive(bounded);
    history.replaceState(null, '', `#${stations[bounded].id}`);
  };
  const driveToCheckpoint = (next, announce = true) => {
    const bounded = Math.max(0, Math.min(stations.length - 1, next));
    const checkpoint = bounded / (stations.length - 1);
    clearTimeout(snapTimer.current);
    scrollAnimation.current?.stop();
    if (isMobile) {
      routeTarget.current = null;
      travelRef.current = checkpoint;
      setCityProgress(checkpoint);
      setStation(bounded);
      return;
    }
    routeTarget.current = bounded;
    if (announce) setStation(bounded);
    const updateRoute = (progress) => {
      travelRef.current = progress;
      setCityProgress(progress);
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      scrollTo({ top: maxScroll * progress, behavior: 'instant' });
    };
    if (reduced) {
      updateRoute(checkpoint);
      routeTarget.current = null;
      if (!announce) setStation(bounded);
      return;
    }
    const distance = Math.abs(checkpoint - travelRef.current);
    scrollAnimation.current = animate(travelRef.current, checkpoint, {
      duration: .52 + distance * .58,
      ease: [.22, 1, .36, 1],
      onUpdate: updateRoute,
      onComplete: () => {
        updateRoute(checkpoint);
        routeTarget.current = null;
        if (!announce) setStation(bounded);
      },
    });
  };
  const navigate = (next) => driveToCheckpoint(next, true);
  useEffect(() => {
    const initial = stations.findIndex((station) => `#${station.id}` === location.hash);
    const initialProgress = initial > 0 ? initial / (stations.length - 1) : 0;
    if (initial > 0) {
      activeRef.current = initial; travelRef.current = initialProgress; setActive(initial); setCityProgress(initialProgress);
    }
    const syncCityToScroll = () => {
      if (isMobile) return;
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const nextProgress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollY / maxScroll)) : 0;
      travelRef.current = nextProgress;
      setCityProgress(nextProgress);
      const nextStation = Math.round(nextProgress * (stations.length - 1));
      if (routeTarget.current == null && nextStation !== activeRef.current) {
        setStation(nextStation);
      }
      clearTimeout(snapTimer.current);
      if (!reduced && routeTarget.current == null) snapTimer.current = setTimeout(() => {
        const nearestStation = Math.round(travelRef.current * (stations.length - 1));
        const checkpoint = nearestStation / (stations.length - 1);
        if (Math.abs(travelRef.current - checkpoint) < .006) return;
        driveToCheckpoint(nearestStation, false);
      }, 220);
    };
    requestAnimationFrame(() => {
      scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * initialProgress, behavior: 'auto' });
      syncCityToScroll();
    });
    addEventListener('scroll', syncCityToScroll, { passive: true });
    return () => { clearTimeout(snapTimer.current); scrollAnimation.current?.stop(); removeEventListener('scroll', syncCityToScroll); };
  }, [reduced, isMobile]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.target.matches('input') || terminal) return;
      const key = event.key.toLowerCase();
      if (!['j', 'k', 'arrowright', 'arrowleft', 'pagedown', 'pageup'].includes(key)) return;
      event.preventDefault();
      navigate(activeRef.current + (['j', 'arrowright', 'pagedown'].includes(key) ? 1 : -1));
    };
    const onWheel = (event) => {
      if (terminal && event.target.closest('.terminal')) return;
      const nested = event.target.closest('.node-grid,.terminal__lines');
      const panel = event.target.closest('.chapter__panel');
      const scrollSurfaces = [nested, panel].filter((surface, index, list) => surface && list.indexOf(surface) === index);
      const canScrollSurface = scrollSurfaces.some((surface) => {
        if (surface.scrollHeight <= surface.clientHeight + 2) return false;
        return event.deltaY > 0
          ? surface.scrollTop + surface.clientHeight < surface.scrollHeight - 2
          : surface.scrollTop > 2;
      });
      if (canScrollSurface) {
        wheelIntent.current = 0;
        clearTimeout(wheelResetTimer.current);
        return;
      }
      event.preventDefault();
      if (routeTarget.current != null) return;
      const deltaUnit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      wheelIntent.current += event.deltaY * deltaUnit;
      clearTimeout(wheelResetTimer.current);
      wheelResetTimer.current = setTimeout(() => { wheelIntent.current = 0; }, 160);
      if (Math.abs(wheelIntent.current) < 36) return;
      const nextStation = Math.max(0, Math.min(stations.length - 1, activeRef.current + Math.sign(wheelIntent.current)));
      wheelIntent.current = 0;
      if (nextStation !== activeRef.current) navigate(nextStation);
    };
    const onTouchStart = (event) => {
      const touch = event.touches[0];
      const panel = event.target.closest('.chapter__panel');
      touchStart.current = touch ? { x: touch.clientX, y: touch.clientY, panel, scrollTop: panel?.scrollTop || 0, scrollHeight: panel?.scrollHeight || 0, clientHeight: panel?.clientHeight || 0 } : null;
    };
    const onTouchEnd = (event) => {
      const start = touchStart.current;
      const touch = event.changedTouches[0];
      if (!start || !touch) return;
      const deltaX = start.x - touch.clientX;
      const deltaY = start.y - touch.clientY;
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 42) { touchStart.current = null; return; }
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        navigate(activeRef.current + (deltaX > 0 ? 1 : -1));
      } else {
        const canKeepScrolling = start.panel && start.scrollHeight > start.clientHeight + 2 && (deltaY > 0
          ? start.scrollTop + start.clientHeight < start.scrollHeight - 2
          : start.scrollTop > 2);
        if (!canKeepScrolling) navigate(activeRef.current + (deltaY > 0 ? 1 : -1));
      }
      touchStart.current = null;
    };
    addEventListener('keydown', onKey); addEventListener('wheel', onWheel, { passive: false });
    addEventListener('touchstart', onTouchStart, { passive: true }); addEventListener('touchend', onTouchEnd, { passive: true });
    return () => { clearTimeout(wheelResetTimer.current); removeEventListener('keydown', onKey); removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTouchStart); removeEventListener('touchend', onTouchEnd); };
  }, [terminal]);
  return <><div className={`experience-shell nexus-experience ${active === 0 ? 'is-entry' : ''}`}>
    <AnimatePresence>{!booted && <BootSequence done={() => setBooted(true)} />}</AnimatePresence>
    <World active={active} reduced={reduced || scenePaused} travel={travelRef} mobile={isMobile} /><div className="noise" /><div className="scanlines" /><CursorSignal />
    <Hud active={active} menu={menu} setMenu={setMenu} navigate={navigate} cityProgress={cityProgress} />
      <aside className="orbital-coordinate" aria-hidden="true"><span>MER23LIN / ORBITAL OBSERVATORY</span><div><i /> SECTOR {stations[active].code} <b>{stations[active].label}</b></div><small>RESEARCH · SYSTEMS · EXPERIENCE</small></aside>
    {active === 0 && <div className="artifact-nodes" aria-label="Explore the intelligence engine"><span className="artifact-nodes__index">FIG. 001 / THE NEXUS</span><button onClick={() => navigate(1)}><span>01</span><b>ENGINEERED SYSTEMS<small>EXPLORE SELECTED WORK</small></b><ArrowUpRight /></button><button onClick={() => navigate(3)}><span>02</span><b>NEURAL ARCHITECTURE<small>DISCOVER THE STACK</small></b><ArrowUpRight /></button><div className="artifact-nodes__status"><i /><span>CORE STABLE</span><b>23.06 / ONLINE</b></div></div>}
    <button className="terminal-trigger" onClick={() => setTerminal(true)}><TerminalIcon /> OPEN TERMINAL</button>
    <button className="scene-pause" type="button" disabled={Boolean(reduced)} aria-pressed={scenePaused || Boolean(reduced)} onClick={() => setScenePaused(value => !value)}>{reduced ? 'REDUCED MOTION' : scenePaused ? 'RESUME SCENE' : 'PAUSE SCENE'}</button>
    <main className="console-stage" data-station={stations[active].code}>
      <Section id="entry" index={0} eyebrow="TRANSMISSION 001 / FROM RESEARCH TO REALITY" className="hero-chapter" active={active === 0} direction={direction}>
        <div className="hero-kicker"><i /> AVAILABLE FOR SELECT COLLABORATIONS</div>
        <div className="identity-line">AMIRREZA GHAFFARIAN <span>AI ENGINEER / CREATIVE TECHNOLOGIST</span></div>
        <h1>BUILDING<br />THE NEXT<br /><em>INTELLIGENCE.</em></h1>
        <p className="hero-lead">AI agents, full-stack systems and high-impact interfaces engineered from research core to production surface.</p>
        <div className="hero-cta"><a href="#featured" onClick={(event) => { event.preventDefault(); navigate(1); }}>EXPLORE MY WORK <ArrowRight /></a><a href="#contact" onClick={(event) => { event.preventDefault(); navigate(6); }}>MAKE CONTACT <Send /></a></div>
        <div className="hero-stats"><div><b>10</b><span>YEARS PROGRAMMING</span></div><div><b>7</b><span>YEARS FRONTEND</span></div><div><b>7</b><span>YEARS AI</span></div><div><b>15+</b><span>COMPANY COLLABS</span></div></div>
        <div className="discipline-strip"><span>RESEARCH → SYSTEMS → EXPERIENCE</span><b>MASHHAD, IRAN / CONNECTED WORLDWIDE</b></div>
        <div className="operator-seal" aria-hidden="true"><span>MER23LIN</span><b>M/23</b><small>ENGINEERED INTELLIGENCE</small></div>
      </Section>

      <Section id="featured" index={1} eyebrow="SELECTED PROOF" title="FEATURED PROJECT VAULT" side="right" active={active === 1} direction={direction}><p className="section-lead">Real problems, explicit roles, inspectable engineering decisions and outcomes.</p><Featured items={featuredProjects} /></Section>

      <Section id="profile" index={2} eyebrow="AUTHORIZED OPERATOR" title="AMIRREZA GHAFFARIAN" active={active === 2} direction={direction}>
        <div className="operator"><div className="operator__photo"><img src="/profile.png" alt="Amirreza Ghaffarian" loading="eager" decoding="async" /><i /></div><div className="operator__copy"><h3>AI AGENT ENGINEER<br /><span>FULL-STACK DEVELOPER</span></h3><p>Engineering autonomous intelligence, production web platforms and visually ambitious digital experiences.</p><dl><div><dt>LOCATION</dt><dd>MASHHAD · IRAN</dd></div><div><dt>ACADEMIC CORE</dt><dd>M.Sc. AI &amp; ROBOTICS · 2026</dd></div><div><dt>STATUS</dt><dd>● OPERATIONAL</dd></div></dl><a href="https://jobinja.ir/user/NL-1212752" target="_blank" rel="noreferrer"><Briefcase /> SOURCE RESUME</a></div></div>
      </Section>

      <Section id="skills" index={3} eyebrow="CAPABILITY MATRIX" title="ENGINEERING STACK" side="right" active={active === 3} direction={direction}>
        <p className="section-lead">From intelligent models to the interfaces people actually use. Six connected disciplines, one end-to-end engineering practice.</p>
        <div className="skill-matrix">{skillGroups.map((group,i)=><article key={group.domain}><div><Code2 /><span>0{i+1}</span></div><h3>{group.domain}</h3><b>{group.signal}</b><p>{group.tools.join(' · ')}</p></article>)}</div>
      </Section>

      <Section id="experience" index={4} eyebrow="PROFESSIONAL TRAJECTORY" title="EXPERIENCE LOG" active={active === 4} direction={direction}>
        <div className="work-log">{experience.map((item,i)=><article key={`${item.company}-${item.period}`}><b>0{i+1}</b><div><small>{item.period} // {item.location}</small><h3>{item.role}</h3><h4>{item.website?<a href={item.website} target="_blank" rel="noreferrer">{item.company} ↗</a>:item.company}</h4><p>{item.description}</p><div>{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div></article>)}</div>
        <div className="education"><GraduationCap /><span>ACADEMIC CORE</span><b>M.Sc. AI &amp; ROBOTICS · COMPLETED 2026</b><small>Islamic Azad University, Mashhad</small></div>
      </Section>

      <Section id="projects" index={5} eyebrow="PUBLIC NETWORK" title="ALL PUBLIC NODES" side="right" active={active === 5} direction={direction}>
        <p className="section-lead">Explore the source. Research experiments, interface systems and developer tools, organized by their implementation language.</p>
        <div className="archive-filters" aria-label="Filter projects by language">{['All', ...new Set(projects.map(project => project.language))].map(value => <button key={value} aria-pressed={language === value} onClick={() => setLanguage(value)}>{value}<span>{value === 'All' ? projects.length : projects.filter(project => project.language === value).length}</span></button>)}</div>
        <div className="archive-tools"><label>SEARCH NETWORK<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="NAME, LANGUAGE OR CAPABILITY" /></label><div><b>{filtered.length}</b> / {projects.length} ONLINE</div></div>
        <div className="node-grid">{filtered.map((project,i)=><a href={project.url} target="_blank" rel="noreferrer" key={project.id} style={{'--node':project.color,'clipPath':cut}}><small>{project.id} // {project.language}</small><h3>{project.title}</h3><p>{project.description}</p><span>{project.type}</span><b>{String(i+1).padStart(2,'0')}</b><ArrowUpRight className="node-arrow" /></a>)}</div>
        {filtered.length === 0 && <div className="archive-empty"><Code2 /><h3>No matching projects</h3><p>Try another keyword or explore the complete archive.</p><button onClick={() => { setQuery(''); setLanguage('All'); }}>RESET FILTERS <ArrowRight /></button></div>}
      </Section>

      <Section id="contact" index={6} eyebrow="FINAL TRANSMISSION" className="contact-chapter" active={active === 6} direction={direction}>
        <p className="pre-manifesto">THE FUTURE IS NOT PREDICTED.</p><h2 className="manifesto" aria-label={manifestoText}>{[...manifestoText].map((char,i)=><span aria-hidden="true" key={`${char}-${i}`} className={char===' '?'space':''} style={{'--d':`${8+i%4*.8}s`,'--delay':`${-i*.73}s`}}>{char===' '?'\u00a0':char}</span>)}</h2>
        <p className="contact-lead">Have an ambitious AI, frontend or full-stack project? Let's turn a clear problem into a thoughtfully engineered product.</p>
        <div className="collaboration-brief"><div><small>01 / CHOOSE YOUR DIRECTION</small><h3>What are we building?</h3></div><div className="brief-options">{['AI & automation', 'Web platform', 'Creative interface'].map(value => <button key={value} aria-pressed={brief === value} onClick={() => setBrief(value)}>{value}<ArrowUpRight /></button>)}</div><p>{brief === 'AI & automation' ? 'Agent workflows, knowledge retrieval and intelligent features connected to your product.' : brief === 'Web platform' ? 'Responsive frontend, application architecture and data integration built around your users.' : 'Interactive worlds, expressive design systems and memorable Three.js experiences.'}</p><a href={`https://t.me/ARGHN23?text=${encodeURIComponent(`Hi Amirreza, I would like to discuss a ${brief.toLowerCase()} project.\nGoal: \nCurrent stage: \nTimeline: `)}`} target="_blank" rel="noreferrer">DISCUSS THIS PROJECT <Send /></a><small>Opens Telegram with an editable project brief.</small></div>
        <div className="contact-grid"><a href="tel:+989152389023"><Phone /><span><small>DIRECT LINE</small>+98 915 238 9023</span></a><a href="https://t.me/ARGHN23" target="_blank" rel="noreferrer"><Send /><span><small>TELEGRAM</small>@ARGHN23</span></a><a href="https://www.instagram.com/amir_.gh23" target="_blank" rel="noreferrer"><Instagram /><span><small>INSTAGRAM</small>@amir_.gh23</span></a></div>
        <div className="social-row"><a href="https://github.com/Amirgh23" target="_blank" rel="noreferrer"><Github /> GITHUB</a><a href="https://www.linkedin.com/in/amirreza-ghaffarian-nokhodi-55371020b" target="_blank" rel="noreferrer"><Linkedin /> LINKEDIN</a></div>
        <footer>© 2026 AMIRGH23 // MER23LIN ORBITAL INTERFACE<br /><span className="asset-credit">3D: <a href="https://sketchfab.com/3d-models/space-station-edf17c3d57584cf2acefc72ecccb8058" target="_blank" rel="noreferrer">Space station</a> by <a href="https://sketchfab.com/FPSunreal" target="_blank" rel="noreferrer">FPSunreal</a> / <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Scale, placement and lighting adapted.</span></footer>
      </Section>
    </main>
    <Terminal open={terminal} close={() => setTerminal(false)} projects={projects} />
  </div><div className="city-scroll-track" aria-hidden="true">{stations.map((station) => <i className="city-snap-point" key={station.id} />)}</div></>;
}
