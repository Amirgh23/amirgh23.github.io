import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Stars } from '@react-three/drei';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown, ArrowUpRight, Briefcase, Code2, Github, GraduationCap,
  Instagram, Linkedin, Menu, Phone, Send, Terminal as TerminalIcon, X,
} from 'lucide-react';
import * as THREE from 'three';

const cut = 'polygon(0 0,calc(100% - 26px) 0,100% 26px,100% calc(100% - 16px),calc(100% - 16px) 100%,26px 100%,0 calc(100% - 26px))';

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
      <small>SCROLL TO TRAVERSE · NO AUDIO REQUIRED</small>
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

function Monitor({ position, rotation = [0, 0, 0], color = '#00eaff', size = [3.3, 1.9] }) {
  return <group position={position} rotation={rotation}>
    <mesh><boxGeometry args={[size[0], size[1], .16]} /><meshStandardMaterial color="#040611" emissive={color} emissiveIntensity={.18} metalness={.8} roughness={.22} /></mesh>
    <mesh position={[0, 0, .095]}><planeGeometry args={[size[0] - .15, size[1] - .15]} /><meshBasicMaterial color={color} transparent opacity={.055} /></mesh>
    <Line points={[[ -size[0]/2, -size[1]/2, .11],[-size[0]/2, size[1]/2, .11],[size[0]/2, size[1]/2, .11]]} color={color} opacity={.8} transparent lineWidth={1} />
  </group>;
}

function Facility({ progress, reduced }) {
  const rig = useRef();
  useFrame((state) => {
    const p = reduced ? 0 : progress.current;
    const targetZ = 8 - p * 31;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, .035);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(p * Math.PI * 3) * 1.15, .025);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, Math.sin(p * Math.PI * 2) * .42, .025);
    state.camera.lookAt(0, 0, targetZ - 6);
    if (rig.current) rig.current.rotation.z = Math.sin(p * Math.PI * 4) * .018;
  });
  return <group ref={rig}>
    <fog attach="fog" args={['#010207', 8, 30]} />
    <ambientLight intensity={.18} />
    <pointLight position={[2, 2, 5]} color="#00eaff" intensity={18} distance={15} />
    <pointLight position={[-3, -2, -10]} color="#ff24c8" intensity={16} distance={14} />
    <Stars radius={32} depth={32} count={900} factor={2} fade speed={.2} />
    <gridHelper args={[80, 80, '#0a4d65', '#08101b']} position={[0, -3.7, -10]} />
    <NeuralCore position={[2.8, .4, 0]} scale={.95} />
    <Monitor position={[-3, .6, -7]} rotation={[0, .32, 0]} color="#ff24c8" />
    <Monitor position={[2.8, -.7, -9]} rotation={[0, -.28, 0]} color="#00eaff" size={[2.8, 1.65]} />
    <NeuralCore position={[-2.7, .2, -14]} scale={.65} />
    <Monitor position={[2.6, .65, -16]} rotation={[0, -.25, 0]} color="#9b6cff" />
    <Monitor position={[-2.6, -.85, -19]} rotation={[0, .3, 0]} color="#00eaff" size={[3, 1.7]} />
    <NeuralCore position={[2.4, .2, -23]} scale={.5} />
    <Monitor position={[-2.8, .45, -26]} rotation={[0, .28, 0]} color="#ff24c8" />
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, 0, 3 - i * 3.4]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[5.1, .018, 6, 96]} /><meshBasicMaterial color={i % 2 ? '#ff24c8' : '#00eaff'} transparent opacity={.16} />
    </mesh>)}
  </group>;
}

function World({ progress, reduced }) {
  return <div className="world" aria-hidden="true"><Canvas camera={{ position: [0, 0, 8], fov: 48 }} dpr={[1, 1.45]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <Suspense fallback={null}><Facility progress={progress} reduced={reduced} /></Suspense>
  </Canvas></div>;
}

function Hud({ active, menu, setMenu }) {
  const labels = [['00','ENTRY'],['01','WORK'],['02','PROFILE'],['03','STACK'],['04','LOG'],['05','ARCHIVE'],['06','UPLINK']];
  return <>
    <header className="hud-top">
      <a href="#entry" className="mark">MER<span>23</span>LIN<small>AUTONOMOUS PORTFOLIO</small></a>
      <div className="telemetry"><i /> FACILITY ONLINE <span>2026 // MASHHAD</span></div>
      <button onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'}>{menu ? <X /> : <Menu />}</button>
    </header>
    <nav className={`rail ${menu ? 'is-open' : ''}`} aria-label="Portfolio sections">
      {labels.map(([n,label], i) => <a key={label} href={`#${['entry','featured','profile','skills','experience','projects','contact'][i]}`} className={active === i ? 'active' : ''} onClick={() => setMenu(false)}><b>{label}</b><span>{n}</span></a>)}
    </nav>
    <div className="hud-corners" aria-hidden="true"><i /><i /><i /><i /></div>
  </>;
}

function Section({ id, index, eyebrow, title, side = 'left', children, className = '' }) {
  return <section id={id} className={`chapter chapter--${side} ${className}`} data-index={index}>
    <motion.div className="chapter__panel" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .2 }} transition={{ duration: .55 }}>
      <div className="chapter__meta"><span>CHAPTER // 0{index}</span><b>{eyebrow}</b></div>
      {title && <h2>{title}</h2>}{children}
    </motion.div>
  </section>;
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
  const [booted, setBooted] = useState(false), [menu, setMenu] = useState(false), [terminal, setTerminal] = useState(false), [query, setQuery] = useState(''), [active, setActive] = useState(0);
  const progress = useRef(0); const reduced = useReducedMotion();
  const filtered = projects.filter(p => `${p.title} ${p.type} ${p.language} ${p.description}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const update = () => { const max = document.documentElement.scrollHeight - innerHeight; progress.current = max > 0 ? scrollY / max : 0; const nodes = [...document.querySelectorAll('.chapter')]; let nearest = 0, distance = Infinity; nodes.forEach((node,i)=>{const d=Math.abs(node.getBoundingClientRect().top-innerHeight*.28);if(d<distance){distance=d;nearest=i;}}); setActive(nearest); };
    update(); addEventListener('scroll', update, { passive: true }); return () => removeEventListener('scroll', update);
  }, []);
  return <div className="experience-shell">
    <AnimatePresence>{!booted && <BootSequence done={() => setBooted(true)} />}</AnimatePresence>
    <World progress={progress} reduced={reduced} /><div className="noise" /><div className="scanlines" />
    <Hud active={active} menu={menu} setMenu={setMenu} />
    <button className="terminal-trigger" onClick={() => setTerminal(true)}><TerminalIcon /> OPEN TERMINAL</button>
    <main>
      <Section id="entry" index={0} eyebrow="WELCOME TO THE NEURAL FACILITY" className="hero-chapter">
        <div className="hero-kicker"><i /> AVAILABLE FOR SELECT COLLABORATIONS</div>
        <h1>THE MIND<br />ENGINEERS<br /><em>THE MACHINE.</em></h1>
        <p className="hero-lead">AI agents, full-stack systems and high-impact interfaces engineered from research core to production surface.</p>
        <div className="hero-cta"><a href="#featured">ENTER FACILITY <ArrowDown /></a><a href="#contact">START A PROJECT <Send /></a></div>
        <div className="hero-stats"><div><b>10</b><span>YEARS PROGRAMMING</span></div><div><b>7</b><span>YEARS FRONTEND</span></div><div><b>7</b><span>YEARS AI</span></div><div><b>15+</b><span>COMPANY COLLABS</span></div></div>
      </Section>

      <Section id="featured" index={1} eyebrow="SELECTED PROOF" title="FEATURED PROJECT VAULT" side="right"><p className="section-lead">Real problems, explicit roles, inspectable engineering decisions and outcomes.</p><Featured items={featuredProjects} /></Section>

      <Section id="profile" index={2} eyebrow="AUTHORIZED OPERATOR" title="AMIRREZA GHAFFARIAN">
        <div className="operator"><div className="operator__photo"><img src="https://github.com/Amirgh23.png?size=600" alt="Amirreza Ghaffarian" /><i /></div><div className="operator__copy"><h3>AI AGENT ENGINEER<br /><span>FULL-STACK DEVELOPER</span></h3><p>Engineering autonomous intelligence, production web platforms and visually ambitious digital experiences.</p><dl><div><dt>LOCATION</dt><dd>MASHHAD · IRAN</dd></div><div><dt>ACADEMIC CORE</dt><dd>M.Sc. AI &amp; ROBOTICS · 2026</dd></div><div><dt>STATUS</dt><dd>● OPERATIONAL</dd></div></dl><a href="https://jobinja.ir/user/NL-1212752" target="_blank" rel="noreferrer"><Briefcase /> SOURCE RESUME</a></div></div>
      </Section>

      <Section id="skills" index={3} eyebrow="CAPABILITY MATRIX" title="ENGINEERING STACK" side="right">
        <div className="skill-matrix">{skillGroups.map((group,i)=><article key={group.domain}><div><Code2 /><span>0{i+1}</span></div><h3>{group.domain}</h3><b>{group.signal}</b><p>{group.tools.join(' · ')}</p></article>)}</div>
      </Section>

      <Section id="experience" index={4} eyebrow="PROFESSIONAL TRAJECTORY" title="EXPERIENCE LOG">
        <div className="work-log">{experience.map((item,i)=><article key={`${item.company}-${item.period}`}><b>0{i+1}</b><div><small>{item.period} // {item.location}</small><h3>{item.role}</h3><h4>{item.website?<a href={item.website} target="_blank" rel="noreferrer">{item.company} ↗</a>:item.company}</h4><p>{item.description}</p><div>{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div></article>)}</div>
        <div className="education"><GraduationCap /><span>ACADEMIC CORE</span><b>M.Sc. AI &amp; ROBOTICS · COMPLETED 2026</b><small>Islamic Azad University, Mashhad</small></div>
      </Section>

      <Section id="projects" index={5} eyebrow="PUBLIC NETWORK" title="ALL PUBLIC NODES" side="right">
        <div className="archive-tools"><label>SEARCH NETWORK<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="NAME, LANGUAGE OR CAPABILITY" /></label><div><b>{filtered.length}</b> / {projects.length} ONLINE</div></div>
        <div className="node-grid">{filtered.map((project,i)=><a href={project.url} target="_blank" rel="noreferrer" key={project.id} style={{'--node':project.color,'clipPath':cut}}><small>{project.id} // {project.language}</small><h3>{project.title}</h3><p>{project.description}</p><span>{project.type}</span><b>{String(i+1).padStart(2,'0')}</b></a>)}</div>
      </Section>

      <Section id="contact" index={6} eyebrow="FINAL TRANSMISSION" className="contact-chapter">
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
