import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Stars } from '@react-three/drei';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Briefcase, Code2, Github, GraduationCap,
  Instagram, Linkedin, Menu, Phone, Send, Terminal as TerminalIcon, X,
} from 'lucide-react';
import * as THREE from 'three';

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
  const lines = ['WAKE NEURAL FACILITY', 'SYNC AUTONOMOUS CORE', 'MAP PROJECT VAULT', 'VERIFY OPERATOR', 'OPEN VISITOR CHANNEL'];
  useEffect(() => {
    const id = setInterval(() => setStep((value) => {
      if (value >= lines.length) { clearInterval(id); setTimeout(done, 260); return value; }
      return value + 1;
    }), 210);
    return () => clearInterval(id);
  }, [done]);
  return <motion.div className="boot" exit={{ opacity: 0 }}>
    <div className="boot__inner">
      <div className="boot__logo">MER<span>23</span>LIN</div>
      <div className="boot__readout">NEURAL FACILITY // VISITOR BOOT</div>
      {lines.map((line, index) => <p key={line} className={index < step ? 'is-ready' : ''}><b>0{index + 1}</b>{line}<span>{index < step ? 'ONLINE' : 'WAIT'}</span></p>)}
      <div className="boot__bar"><i style={{ width: `${step / lines.length * 100}%` }} /></div>
      <small>SELECT A NODE · WHEEL / SWIPE / J K · NO AUDIO REQUIRED</small>
    </div>
  </motion.div>;
}

function NeuralCore({ position = [0, 0, 0], scale = 1 }) {
  const ref = useRef();
  const arcs = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const a = i / 14 * Math.PI * 2;
    return [[0, 0, 0], [Math.cos(a) * (1.8 + i % 3 * .24), Math.sin(a * 2.1) * .6, Math.sin(a) * 1.8]];
  }), []);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * .22;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * .35) * .08;
  });
  return <group ref={ref} position={position} scale={scale}>
    <Float speed={1.4} floatIntensity={.28} rotationIntensity={.25}>
      <mesh><icosahedronGeometry args={[1.1, 2]} /><meshStandardMaterial color="#020510" emissive="#00eaff" emissiveIntensity={2.2} wireframe /></mesh>
      <mesh><icosahedronGeometry args={[.54, 2]} /><meshStandardMaterial color="#ff24c8" emissive="#ff24c8" emissiveIntensity={3.8} /></mesh>
    </Float>
    {arcs.map((points, i) => <Line key={i} points={points} color={i % 2 ? '#ff24c8' : '#00eaff'} transparent opacity={.46} lineWidth={.7} />)}
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.55, .025, 8, 96]} /><meshBasicMaterial color="#00eaff" /></mesh>
    <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[1.85, .018, 8, 96]} /><meshBasicMaterial color="#ff24c8" /></mesh>
  </group>;
}

function DataShard({ position, color, speed = 1, scale = 1 }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * .18 * speed;
    ref.current.rotation.y += delta * .27 * speed;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * .5 * speed + position[2]) * .18;
  });
  return <group ref={ref} position={position} scale={scale}>
    <mesh><octahedronGeometry args={[.55, 0]} /><meshStandardMaterial color="#02040c" emissive={color} emissiveIntensity={.7} wireframe /></mesh>
    <mesh scale={.27}><octahedronGeometry args={[.55, 0]} /><meshBasicMaterial color={color} /></mesh>
  </group>;
}

function Facility({ active, reduced }) {
  const rig = useRef();
  const cameraTargets = [
    [0, 0, 8], [1.8, .15, 5.8], [-1.5, .45, 6.4], [1.4, -.3, 5.9],
    [-1.25, -.35, 6.2], [1.1, .55, 5.7], [0, .1, 5.35],
  ];
  useFrame((state) => {
    const target = reduced ? cameraTargets[0] : cameraTargets[active];
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, target[0], .035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, target[1], .035);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, target[2], .035);
    state.camera.lookAt(0, 0, -1.5);
    if (rig.current) {
      rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, active * -.13, .025);
      rig.current.rotation.z = THREE.MathUtils.lerp(rig.current.rotation.z, (active % 2 ? 1 : -1) * .012, .025);
    }
  });
  return <group ref={rig}>
    <fog attach="fog" args={['#010207', 8, 30]} />
    <ambientLight intensity={.18} />
    <pointLight position={[2, 2, 5]} color="#00eaff" intensity={18} distance={15} />
    <pointLight position={[-3, -2, -10]} color="#ff24c8" intensity={16} distance={14} />
    <Stars radius={32} depth={32} count={900} factor={2} fade speed={.2} />
    <gridHelper args={[80, 80, '#0a4d65', '#08101b']} position={[0, -3.7, -10]} />
    <NeuralCore position={[2.8, .4, 0]} scale={.95} />
    <NeuralCore position={[-2.7, .2, -14]} scale={.65} />
    <NeuralCore position={[2.4, .2, -23]} scale={.5} />
    <DataShard position={[-4.2, 1.8, -4]} color="#00eaff" speed={.8} />
    <DataShard position={[4.4, -1.2, -11]} color="#ff24c8" speed={1.2} scale={.7} />
    <DataShard position={[-4.5, -.2, -18]} color="#9b6cff" speed={.65} scale={1.25} />
    <DataShard position={[4.1, 1.4, -25]} color="#00eaff" speed={1.4} scale={.65} />
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, 0, 3 - i * 3.4]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[5.1, .018, 6, 96]} /><meshBasicMaterial color={i % 2 ? '#ff24c8' : '#00eaff'} transparent opacity={.16} />
    </mesh>)}
  </group>;
}

function World({ active, reduced }) {
  return <div className="world" aria-hidden="true"><Canvas camera={{ position: [0, 0, 8], fov: 48 }} dpr={[1, 1.45]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <Suspense fallback={null}><Facility active={active} reduced={reduced} /></Suspense>
  </Canvas></div>;
}

function Hud({ active, menu, setMenu, navigate }) {
  const station = stations[active];
  const travelTo = (event, index) => {
    event.preventDefault();
    navigate(index);
    setMenu(false);
  };
  return <>
    <header className="hud-top">
      <a href="#entry" className="mark">MER<span>23</span>LIN<small>AUTONOMOUS PORTFOLIO</small></a>
      <div className="telemetry"><i /> FACILITY ONLINE <span>{station.signal} // NODE-{station.code}</span></div>
      <button onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'}>{menu ? <X /> : <Menu />}</button>
    </header>
    <nav className={`rail ${menu ? 'is-open' : ''}`} aria-label="Portfolio sections">
      {stations.map((item, i) => <a key={item.id} href={`#${item.id}`} className={active === i ? 'active' : ''} onClick={(event) => travelTo(event, i)}><b>{item.label}</b><span>{item.code}</span></a>)}
    </nav>
    <div className="hud-corners" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="flight-deck" aria-live="polite">
      <div className="flight-deck__station"><small>CURRENT STATION</small><b>{station.code} // {station.label}</b></div>
      <button className="flight-deck__step" onClick={() => navigate(active - 1)} disabled={active === 0} aria-label="Previous station"><ArrowLeft /></button>
      <div className="flight-deck__route">{stations.map((item, index) => <button key={item.id} className={index === active ? 'active' : index < active ? 'passed' : ''} onClick={() => navigate(index)} aria-label={`Open ${item.label}`} />)}</div>
      <div className="flight-deck__percent">{String(active + 1).padStart(2, '0')}<small>/ {String(stations.length).padStart(2, '0')} NODES</small></div>
      <button className="flight-deck__step" onClick={() => navigate(active + 1)} disabled={active === stations.length - 1} aria-label="Next station"><ArrowRight /></button>
      <div className="flight-deck__keys">WHEEL · SWIPE · J / K</div>
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
  const screenColors = ['#00eaff', '#ff24c8', '#00eaff', '#9b6cff', '#00eaff', '#ff24c8', '#00eaff'];
  const variants = reduceMotion ? { enter: { opacity: 1 }, center: { opacity: 1 }, exit: { opacity: 0 } } : {
    enter: (way) => ({ opacity: 0, scale: .72, rotateY: way * -12, x: way * 170, filter: 'blur(14px)' }),
    center: { opacity: 1, scale: 1, rotateY: 0, x: 0, filter: 'blur(0px)' },
    exit: (way) => ({ opacity: 0, scale: 1.16, rotateY: way * 8, x: way * -120, filter: 'blur(12px)' }),
  };
  return <AnimatePresence mode="sync" custom={direction}>{active && <motion.section key={id} id={id} className={`chapter chapter--${side} ${className} is-console-active`} data-index={index} style={{ '--screen': screenColors[index] }} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 145, damping: 24, mass: .72, opacity: { duration: .24 }, filter: { duration: .3 } }}>
    <motion.div className="screen-dock console-window">
      <div className="screen-hardware" aria-hidden="true"><i /><i /><i /><b>DISPLAY M23-{String(index).padStart(2, '0')}</b><span>◈</span></div>
      <div className="chapter__panel">
        <div className="chapter__meta"><span>CHAPTER // 0{index}</span><b>{eyebrow}</b></div>
        {title && <h2>{title}</h2>}{children}
      </div>
      <div className="screen-bus" aria-hidden="true"><i /><i /><i /><i /><span /></div>
    </motion.div>
  </motion.section>}</AnimatePresence>;
}

function Featured({ items }) {
  const [selected, setSelected] = useState(0);
  const item = items[selected];
  return <div className="case-console">
    <div className="case-tabs">{items.map((project, i) => <button key={project.id} className={i === selected ? 'active' : ''} onClick={() => setSelected(i)}><span>0{i + 1}</span>{project.title}</button>)}</div>
    <AnimatePresence mode="wait"><motion.article key={item.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
      <div className="case-title"><span>{item.category}</span><h3>{item.title}</h3><strong>{item.proof}</strong></div>
      <div className="case-grid"><div><small>PROBLEM</small><p>{item.problem}</p></div><div><small>SOLUTION</small><p>{item.solution}</p></div><div><small>ROLE</small><p>{item.role}</p></div><div><small>OUTCOME</small><p>{item.result}</p></div></div>
      <div className="case-bottom"><div>{item.stack.map(tag => <span key={tag}>{tag}</span>)}</div><a href={item.url} target="_blank" rel="noreferrer">INSPECT CASE <ArrowUpRight /></a></div>
    </motion.article></AnimatePresence>
  </div>;
}

function Terminal({ open, close, projects }) {
  const [value, setValue] = useState('');
  const [lines, setLines] = useState(['MER23LIN VISITOR TERMINAL READY', 'TYPE: help']);
  const submit = (event) => {
    event.preventDefault(); const command = value.trim().toLowerCase();
    const map = { help:'about · work · stack · contact · clear', about:'AMIRREZA GHAFFARIAN // AI AGENT ENGINEER + FULL-STACK DEVELOPER', work:`${projects.length} PUBLIC NODES // 4 FEATURED CASES`, stack:'REACT · NEXT.JS · TYPESCRIPT · ANGULAR · PYTHON · MONGODB · POSTGRESQL · THREE.JS', contact:'TEL +98 915 238 9023 // TELEGRAM @ARGHN23' };
    setLines(command === 'clear' ? [] : [...lines, `> ${value}`, map[command] || `UNKNOWN SIGNAL: ${command || '[EMPTY]'}`]); setValue('');
  };
  return <AnimatePresence>{open && <motion.div className="terminal" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} role="dialog" aria-label="MER23LIN terminal">
    <div className="terminal__bar"><span>VISITOR://TERMINAL</span><button onClick={close}>×</button></div><div className="terminal__lines">{lines.map((line,i)=><p key={`${line}-${i}`}>{line}</p>)}</div>
    <form onSubmit={submit}><b>Ω</b><input autoFocus value={value} onChange={e=>setValue(e.target.value)} aria-label="Terminal command" /></form>
  </motion.div>}</AnimatePresence>;
}

export default function PortfolioExperience({ projects, featuredProjects, skillGroups, experience, manifestoText }) {
  const [booted, setBooted] = useState(false), [menu, setMenu] = useState(false), [terminal, setTerminal] = useState(false), [query, setQuery] = useState(''), [active, setActive] = useState(0), [direction, setDirection] = useState(1);
  const activeRef = useRef(0), wheelLock = useRef(false), touchStart = useRef(null); const reduced = useReducedMotion();
  const filtered = projects.filter(p => `${p.title} ${p.type} ${p.language} ${p.description}`.toLowerCase().includes(query.toLowerCase()));
  const navigate = (next) => {
    const bounded = Math.max(0, Math.min(stations.length - 1, next));
    if (bounded === activeRef.current) return;
    setDirection(bounded > activeRef.current ? 1 : -1);
    activeRef.current = bounded;
    setActive(bounded);
    history.replaceState(null, '', `#${stations[bounded].id}`);
  };
  useEffect(() => {
    const initial = stations.findIndex((station) => `#${station.id}` === location.hash);
    if (initial > 0) { activeRef.current = initial; setActive(initial); }
  }, []);
  useEffect(() => {
    const onKey = (event) => {
      if (event.target.matches('input') || terminal) return;
      const key = event.key.toLowerCase();
      if (!['j', 'k', 'arrowright', 'arrowleft', 'pagedown', 'pageup'].includes(key)) return;
      event.preventDefault();
      navigate(activeRef.current + (['j', 'arrowright', 'pagedown'].includes(key) ? 1 : -1));
    };
    const onWheel = (event) => {
      const scrollable = event.target.closest('.chapter__panel,.node-grid,.terminal__lines');
      if (scrollable) {
        const canContinue = event.deltaY > 0 ? scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 2 : scrollable.scrollTop > 2;
        if (canContinue) return;
      }
      if (Math.abs(event.deltaY) < 28 || wheelLock.current) return;
      wheelLock.current = true;
      navigate(activeRef.current + (event.deltaY > 0 ? 1 : -1));
      setTimeout(() => { wheelLock.current = false; }, 720);
    };
    const onTouchStart = (event) => { touchStart.current = event.touches[0]?.clientX ?? null; };
    const onTouchEnd = (event) => {
      if (touchStart.current == null) return;
      const delta = touchStart.current - (event.changedTouches[0]?.clientX ?? touchStart.current);
      if (Math.abs(delta) > 55) navigate(activeRef.current + (delta > 0 ? 1 : -1));
      touchStart.current = null;
    };
    addEventListener('keydown', onKey); addEventListener('wheel', onWheel, { passive: true });
    addEventListener('touchstart', onTouchStart, { passive: true }); addEventListener('touchend', onTouchEnd, { passive: true });
    return () => { removeEventListener('keydown', onKey); removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTouchStart); removeEventListener('touchend', onTouchEnd); };
  }, [terminal]);
  return <div className="experience-shell">
    <AnimatePresence>{!booted && <BootSequence done={() => setBooted(true)} />}</AnimatePresence>
    <World active={active} reduced={reduced} /><div className="noise" /><div className="scanlines" /><CursorSignal />
    <Hud active={active} menu={menu} setMenu={setMenu} navigate={navigate} />
    <button className="terminal-trigger" onClick={() => setTerminal(true)}><TerminalIcon /> OPEN TERMINAL</button>
    <main className="console-stage" data-station={stations[active].code}>
      <Section id="entry" index={0} eyebrow="WELCOME TO THE NEURAL FACILITY" className="hero-chapter" active={active === 0} direction={direction}>
        <div className="hero-kicker"><i /> AVAILABLE FOR SELECT COLLABORATIONS</div>
        <h1>THE MIND<br />ENGINEERS<br /><em>THE MACHINE.</em></h1>
        <p className="hero-lead">AI agents, full-stack systems and high-impact interfaces engineered from research core to production surface.</p>
        <div className="hero-cta"><a href="#featured" onClick={(event) => { event.preventDefault(); navigate(1); }}>ENTER FACILITY <ArrowRight /></a><a href="#contact" onClick={(event) => { event.preventDefault(); navigate(6); }}>START A PROJECT <Send /></a></div>
        <div className="hero-stats"><div><b>10</b><span>YEARS PROGRAMMING</span></div><div><b>7</b><span>YEARS FRONTEND</span></div><div><b>7</b><span>YEARS AI</span></div><div><b>15+</b><span>COMPANY COLLABS</span></div></div>
        <div className="operator-seal" aria-hidden="true"><span>MER23LIN</span><b>M/23</b><small>ENGINEERED INTELLIGENCE</small></div>
      </Section>

      <Section id="featured" index={1} eyebrow="SELECTED PROOF" title="FEATURED PROJECT VAULT" side="right" active={active === 1} direction={direction}><p className="section-lead">Real problems, explicit roles, inspectable engineering decisions and outcomes.</p><Featured items={featuredProjects} /></Section>

      <Section id="profile" index={2} eyebrow="AUTHORIZED OPERATOR" title="AMIRREZA GHAFFARIAN" active={active === 2} direction={direction}>
        <div className="operator"><div className="operator__photo"><img src="https://github.com/Amirgh23.png?size=600" alt="Amirreza Ghaffarian" /><i /></div><div className="operator__copy"><h3>AI AGENT ENGINEER<br /><span>FULL-STACK DEVELOPER</span></h3><p>Engineering autonomous intelligence, production web platforms and visually ambitious digital experiences.</p><dl><div><dt>LOCATION</dt><dd>MASHHAD · IRAN</dd></div><div><dt>ACADEMIC CORE</dt><dd>M.Sc. AI &amp; ROBOTICS · 2026</dd></div><div><dt>STATUS</dt><dd>● OPERATIONAL</dd></div></dl><a href="https://jobinja.ir/user/NL-1212752" target="_blank" rel="noreferrer"><Briefcase /> SOURCE RESUME</a></div></div>
      </Section>

      <Section id="skills" index={3} eyebrow="CAPABILITY MATRIX" title="ENGINEERING STACK" side="right" active={active === 3} direction={direction}>
        <div className="skill-matrix">{skillGroups.map((group,i)=><article key={group.domain}><div><Code2 /><span>0{i+1}</span></div><h3>{group.domain}</h3><b>{group.signal}</b><p>{group.tools.join(' · ')}</p></article>)}</div>
      </Section>

      <Section id="experience" index={4} eyebrow="PROFESSIONAL TRAJECTORY" title="EXPERIENCE LOG" active={active === 4} direction={direction}>
        <div className="work-log">{experience.map((item,i)=><article key={`${item.company}-${item.period}`}><b>0{i+1}</b><div><small>{item.period} // {item.location}</small><h3>{item.role}</h3><h4>{item.website?<a href={item.website} target="_blank" rel="noreferrer">{item.company} ↗</a>:item.company}</h4><p>{item.description}</p><div>{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div></article>)}</div>
        <div className="education"><GraduationCap /><span>ACADEMIC CORE</span><b>M.Sc. AI &amp; ROBOTICS · COMPLETED 2026</b><small>Islamic Azad University, Mashhad</small></div>
      </Section>

      <Section id="projects" index={5} eyebrow="PUBLIC NETWORK" title="ALL PUBLIC NODES" side="right" active={active === 5} direction={direction}>
        <div className="archive-tools"><label>SEARCH NETWORK<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="NAME, LANGUAGE OR CAPABILITY" /></label><div><b>{filtered.length}</b> / {projects.length} ONLINE</div></div>
        <div className="node-grid">{filtered.map((project,i)=><a href={project.url} target="_blank" rel="noreferrer" key={project.id} style={{'--node':project.color,'clipPath':cut}}><small>{project.id} // {project.language}</small><h3>{project.title}</h3><p>{project.description}</p><span>{project.type}</span><b>{String(i+1).padStart(2,'0')}</b></a>)}</div>
      </Section>

      <Section id="contact" index={6} eyebrow="FINAL TRANSMISSION" className="contact-chapter" active={active === 6} direction={direction}>
        <p className="pre-manifesto">THE FUTURE IS NOT PREDICTED.</p><h2 className="manifesto" aria-label={manifestoText}>{[...manifestoText].map((char,i)=><span aria-hidden="true" key={`${char}-${i}`} className={char===' '?'space':''} style={{'--d':`${8+i%4*.8}s`,'--delay':`${-i*.73}s`}}>{char===' '?'\u00a0':char}</span>)}</h2>
        <p className="contact-lead">Have an ambitious AI, frontend or full-stack project? Establish a direct uplink.</p>
        <div className="contact-grid"><a href="tel:+989152389023"><Phone /><span><small>DIRECT LINE</small>+98 915 238 9023</span></a><a href="https://t.me/ARGHN23" target="_blank" rel="noreferrer"><Send /><span><small>TELEGRAM</small>@ARGHN23</span></a><a href="https://www.instagram.com/amir_.gh23" target="_blank" rel="noreferrer"><Instagram /><span><small>INSTAGRAM</small>@amir_.gh23</span></a></div>
        <div className="social-row"><a href="https://github.com/Amirgh23" target="_blank" rel="noreferrer"><Github /> GITHUB</a><a href="https://www.linkedin.com/in/amirreza-ghaffarian-nokhodi-55371020b" target="_blank" rel="noreferrer"><Linkedin /> LINKEDIN</a></div>
        <footer>© 2026 AMIRGH23 // MER23LIN NEURAL FACILITY</footer>
      </Section>
    </main>
    <Terminal open={terminal} close={() => setTerminal(false)} projects={projects} />
  </div>;
}
