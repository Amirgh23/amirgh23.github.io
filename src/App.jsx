import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, OrbitControls, Stars } from '@react-three/drei';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Briefcase,
  Code2,
  Database,
  Github,
  Globe2,
  GraduationCap,
  Instagram,
  Linkedin,
  Phone,
  Power,
  Radio,
  Send,
  Terminal as TerminalIcon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import * as THREE from 'three';

const palette = ['#00f7ff', '#ff2bd6', '#8b5cf6', '#ff304f', '#39ff14'];

const projects = [
  ['amirgh23.github.io', 'MER23LIN INTERFACE', 'JavaScript', 'Interactive MER23LIN — autonomous intelligence command center', 0],
  ['Amirgh23', 'PROFILE COMMAND NODE', 'JavaScript', 'Cyberpunk GitHub profile — AI, full-stack engineering and robotics from Mashhad', 0],
  ['gold-trading-bot', 'AUTONOMOUS MARKET AGENT', 'Python', 'Production-grade XAUUSD trading bot with multi-strategy ensemble and advanced risk management', 3],
  ['special-date', 'TEMPORAL INTERFACE', 'SCSS', 'Experimental date-focused interface system', 2],
  ['pc-ehoa-feature-selection', 'OPTIMIZATION SENTINEL', 'Python', 'Perturbation-consensus feature selection with reproducible experiments and ablation study', 0],
  ['vgar-ppo', 'ADAPTIVE POLICY ENGINE', 'TeX', 'Validation-gated adaptive rollout reuse for PPO', 0],
  ['persian-gpt2-qa', 'LANGUAGE INTELLIGENCE', 'Python', 'Persian GPT-2 question-answering experiment', 0],
  ['bert-imdb-sentiment-analysis', 'SENTIMENT ANALYSIS NODE', 'Python', 'Bilingual Persian-English BERT sentiment classification on IMDB', 0],
  ['t5-text-summarization', 'SUMMARIZATION NODE', 'Python', 'Text summarization with a pretrained T5 model', 0],
  ['rag-class-project', 'KNOWLEDGE RETRIEVAL', 'Python', 'Dependency-free local RAG classroom project', 0],
  ['reinforcement-learning-assignments-2-3', 'REINFORCEMENT LAB', 'Python', 'Bandit and recycling-robot reinforcement learning assignments', 0],
  ['ehoa-feature-selection', 'MEDICAL OPTIMIZATION', 'Python', 'Leakage-free EHOA medical feature selection implementation', 0],
  ['jalali-date-picker', 'PERSIAN TIME MODULE', 'TypeScript', 'Jalali date selection interface', 2],
  ['rhuds-pro', 'HUD DESIGN SYSTEM', 'TypeScript', 'React HUD design system with 50+ production-ready components', 2],
  ['jalali-web-component', 'JALALI WEB MODULE', 'TypeScript', 'Reusable Jalali calendar web component', 2],
  ['diagnostics', 'SYSTEM DIAGNOSTICS', 'JavaScript', 'Diagnostics and system inspection utilities', 0],
  ['Adobe-Premiere', 'MEDIA TOOLING ARCHIVE', 'JavaScript', 'Adobe Premiere related tooling archive', 2],
].map(([name, type, language, description, stars], index) => ({
  id: `N-${String(index + 1).padStart(2, '0')}`,
  title: name.toUpperCase(),
  type,
  language,
  description,
  stars,
  url: `https://github.com/Amirgh23/${name}`,
  color: palette[index % palette.length],
}));

const capabilityModules = [
  ['FRONTEND ENGINEERING', 'React, TypeScript, Next.js, state architecture and high-density interfaces', 'CORE'],
  ['FULL-STACK SYSTEMS', 'Product logic, API integration, MongoDB and PostgreSQL data layers', 'CORE'],
  ['AI AGENT NETWORKS', 'Tool use, orchestration, memory and dependable task execution', 'CORE'],
  ['WORDPRESS DELIVERY', 'International business websites, SEO and production maintenance', 'ADVANCED'],
  ['VISION & LEARNING', 'PyTorch, TensorFlow, OpenCV, YOLO and image-processing pipelines', 'ADVANCED'],
  ['INTERACTIVE 3D', 'Three.js experiences, Blender assets and visual interface systems', 'WORKING'],
];

const skillGroups = [
  {
    domain: 'FRONTEND CORE',
    signal: 'CORE',
    tools: ['HTML5', 'CSS3', 'JavaScript ES6+', 'TypeScript', 'React', 'React Hooks', 'Redux', 'Next.js'],
  },
  {
    domain: 'UI SYSTEMS',
    signal: 'CORE',
    tools: ['Tailwind CSS', 'Bootstrap', 'MUI', 'CSS Grid', 'Flexbox', 'Responsive UI', 'Angular · Familiar'],
  },
  {
    domain: 'FULL STACK & DATA',
    signal: 'PRODUCTION',
    tools: ['API Integration', 'MongoDB', 'PostgreSQL', 'Git', 'Application Architecture'],
  },
  {
    domain: 'AI & COMPUTER VISION',
    signal: 'ADVANCED',
    tools: ['Python', 'PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'YOLO', 'NumPy', 'Pandas', 'MATLAB'],
  },
  {
    domain: 'WEB DELIVERY',
    signal: 'PRODUCTION',
    tools: ['WordPress', 'Technical SEO', 'Screaming Frog', 'Commerce Sites', 'Bilingual Sites'],
  },
  {
    domain: 'CREATIVE TECHNOLOGY',
    signal: 'WORKING',
    tools: ['Three.js', 'Blender 3D', 'Photoshop', 'Interactive Experiences'],
  },
];

const experience = [
  {
    period: 'OCT 2025 — PRESENT',
    role: 'AI AGENT ENGINEER & FULL-STACK DEVELOPER',
    company: 'PARSEH PARDAZ NIK DANESH',
    location: 'MASHHAD · IRAN',
    website: 'https://ppnd.ir/',
    description: 'Engineering agentic AI capabilities and full-stack software products for an integrated human-resources management company across intelligent workflows, application logic, data systems and production interfaces.',
    tags: ['AI AGENTS', 'FULL STACK', 'PRODUCT ENGINEERING'],
  },
  {
    period: '2024 — PRESENT',
    role: 'WORDPRESS & WEB DEVELOPER',
    company: 'INTERNATIONAL COLLABORATION NETWORK',
    location: 'AUSTRALIA · USA · IRAN',
    description: 'Collaborated with more than 15 companies on WordPress websites in the last two years while completing 10+ additional small programming projects.',
    tags: ['15+ COMPANIES', '10+ CODE PROJECTS', 'WORDPRESS'],
  },
  {
    period: '2024 — 2025',
    role: 'SENIOR WEB SPECIALIST',
    company: 'MARHAM ANDISHEH SALAMAT · ZUIKO JAPAN REPRESENTATIVE',
    location: 'IRAN',
    description: 'Delivered iwpsa.ir, woundacademy.ir and the bilingual React + Three.js experience zuiko.ir.',
    tags: ['REACT', 'THREE.JS', 'WORDPRESS'],
  },
  {
    period: 'AUG — DEC 2023',
    role: 'FRONTEND & AI DEVELOPER',
    company: 'AIANDHEALTH.NET',
    location: 'UNITED STATES',
    description: 'Built frontend and AI components for two recommendation web apps supporting methadone and acetaminophen poisoning control.',
    tags: ['FRONTEND', 'AI', 'HEALTH TECH'],
  },
];

function BootScreen({ onComplete }) {
  const [line, setLine] = useState(0);
  const logs = ['INITIALIZING MER23LIN KERNEL', 'MOUNTING VECTOR MEMORY', 'LINKING AUTONOMOUS AGENTS', 'CALIBRATING FULL-STACK BUS', 'SECURE CHANNEL ESTABLISHED'];
  useEffect(() => {
    const timer = setInterval(() => setLine((value) => {
      if (value >= logs.length) {
        clearInterval(timer);
        setTimeout(onComplete, 350);
        return value;
      }
      return value + 1;
    }), 260);
    return () => clearInterval(timer);
  }, [onComplete]);

  return <motion.div className="boot" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
    <div className="boot-box">
      <div className="boot-mark">M<span>/</span>23</div>
      {logs.slice(0, line).map((log, index) => <p key={log}><span>{String(index + 1).padStart(2, '0')}</span> {log} <b>OK</b></p>)}
      <div className="boot-progress"><i style={{ width: `${Math.min(line / logs.length * 100, 100)}%` }} /></div>
      <small>OMEGA CLEARANCE REQUIRED // AUTHORIZED NODE DETECTED</small>
    </div>
  </motion.div>;
}

function CoreMesh() {
  const group = useRef();
  const particles = useMemo(() => Array.from({ length: 22 }, (_, index) => {
    const angle = index / 22 * Math.PI * 2;
    const radius = 2.2 + (index % 3) * 0.45;
    return [Math.cos(angle) * radius, Math.sin(angle * 2) * 0.55, Math.sin(angle) * radius];
  }), []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.13;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
    }
  });

  return <group ref={group}>
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
      <mesh><icosahedronGeometry args={[1.15, 2]} /><meshStandardMaterial color="#06101f" emissive="#00f7ff" emissiveIntensity={1.8} wireframe /></mesh>
      <mesh><icosahedronGeometry args={[0.66, 1]} /><meshStandardMaterial color="#ff2bd6" emissive="#8b5cf6" emissiveIntensity={2.5} /></mesh>
    </Float>
    {particles.map((position, index) => <group key={index}>
      <mesh position={position}><sphereGeometry args={[0.055, 8, 8]} /><meshBasicMaterial color={index % 2 ? '#ff2bd6' : '#00f7ff'} /></mesh>
      <Line points={[[0, 0, 0], position]} color={index % 2 ? '#8b5cf6' : '#00f7ff'} opacity={0.2} transparent lineWidth={0.5} />
    </group>)}
  </group>;
}

function NeuralScene() {
  return <Canvas camera={{ position: [0, 0, 7], fov: 44 }} dpr={[1, 1.5]}>
    <ambientLight intensity={0.35} />
    <pointLight position={[3, 3, 4]} color="#00f7ff" intensity={15} />
    <pointLight position={[-4, -2, 2]} color="#ff2bd6" intensity={12} />
    <Stars radius={25} depth={15} count={700} factor={2} fade speed={0.35} />
    <CoreMesh />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
  </Canvas>;
}

function DataRain() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const chars = '01AIΩ∆RAGMCP//';
    let frame;
    let drops = [];
    const resize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      drops = Array(Math.ceil(innerWidth / 24)).fill(0).map(() => Math.random() * -40);
    };
    const draw = () => {
      context.fillStyle = 'rgba(2,3,10,.08)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = '12px monospace';
      drops.forEach((position, index) => {
        context.fillStyle = index % 7 ? 'rgba(0,247,255,.16)' : 'rgba(255,43,214,.18)';
        context.fillText(chars[Math.floor(Math.random() * chars.length)], index * 24, position * 18);
        drops[index] = position * 18 > canvas.height && Math.random() > 0.985 ? 0 : position + 0.45;
      });
      frame = requestAnimationFrame(draw);
    };
    resize();
    addEventListener('resize', resize);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('resize', resize);
    };
  }, []);
  return <canvas className="data-rain" ref={canvasRef} aria-hidden="true" />;
}

function Terminal({ open, onClose }) {
  const [history, setHistory] = useState([{ type: 'sys', text: 'MER23LIN terminal online. Type help.' }]);
  const [input, setInput] = useState('');
  const run = (event) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    const output = {
      help: 'COMMANDS: about · experience · projects · skills · education · contact · clear',
      about: 'AMIRGH23 // AI Agent Engineer // Full-Stack Developer // Mashhad, Iran',
      experience: 'PARSEH PARDAZ NIK DANESH // 15+ INTERNATIONAL WEB COLLABORATIONS // 10+ RECENT CODE PROJECTS',
      projects: projects.map((project) => `${project.id}: ${project.title}`).join('  |  '),
      skills: 'REACT · NEXT.JS · TYPESCRIPT · ANGULAR · MONGODB · POSTGRESQL · WORDPRESS · PYTHON · PYTORCH · OPENCV',
      education: 'M.Sc. AI & ROBOTICS // COMPLETED 2026',
      contact: 'GITHUB: github.com/Amirgh23  //  LINKEDIN UPLINK AVAILABLE',
    }[command] || `UNKNOWN COMMAND: ${command || '[EMPTY]'}`;
    setHistory(command === 'clear' ? [] : [...history, { type: 'cmd', text: `> ${input}` }, { type: 'out', text: output }]);
    setInput('');
  };

  return <AnimatePresence>{open && <motion.div className="terminal-shell" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} role="dialog" aria-label="MER23LIN terminal">
    <div className="terminal-bar"><span>TERMINAL://AMIRGH23</span><button onClick={onClose} aria-label="Close terminal">×</button></div>
    <div className="terminal-output">{history.map((item, index) => <p className={item.type} key={index}>{item.text}</p>)}</div>
    <form onSubmit={run}><span>Ω</span><input autoFocus value={input} onChange={(event) => setInput(event.target.value)} aria-label="Terminal command" autoComplete="off" /></form>
  </motion.div>}</AnimatePresence>;
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [audio, setAudio] = useState(false);
  const [query, setQuery] = useState('');
  const reduceMotion = useReducedMotion();
  const filteredProjects = projects.filter((project) => `${project.title} ${project.type} ${project.language} ${project.description}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const move = (event) => {
      document.documentElement.style.setProperty('--mx', `${(event.clientX / innerWidth - 0.5) * 16}px`);
      document.documentElement.style.setProperty('--my', `${(event.clientY / innerHeight - 0.5) * 16}px`);
    };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  }, []);

  return <>
    <AnimatePresence>{!booted && <BootScreen onComplete={() => setBooted(true)} />}</AnimatePresence>
    <DataRain />
    <div className="scanlines" aria-hidden="true" />

    <header>
      <a href="#top" className="brand">AMIRGH23<span>//MER23LIN</span></a>
      <nav><a href="#skills">STACK</a><a href="#experience">EXPERIENCE</a><a href="#projects">NODES</a><a href="#contact">UPLINK</a></nav>
      <div className="controls">
        <button onClick={() => setAudio(!audio)} aria-label={audio ? 'Disable interface audio' : 'Enable interface audio'}>{audio ? <Volume2 /> : <VolumeX />}</button>
        <button onClick={() => setTerminal(true)} aria-label="Open terminal"><TerminalIcon /></button>
      </div>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> NETWORK STATUS: ONLINE</div>
          <h1>ENGINEERING<br /><em>INTELLIGENCE</em><br />INTO PRODUCTS.</h1>
          <p>AI agents, full-stack systems and high-impact interfaces — engineered from research core to production surface.</p>
          <div className="hero-actions"><a href="#experience">OPEN EXPERIENCE LOG <Power /></a><button onClick={() => setTerminal(true)}>OPEN TERMINAL <TerminalIcon /></button></div>
          <div className="metrics career-metrics">
            <div><b>7+</b><span>YEARS PROGRAMMING</span></div>
            <div><b>5+</b><span>YEARS FRONTEND</span></div>
            <div><b>15+</b><span>COMPANY COLLABS</span></div>
            <div><b>10+</b><span>RECENT CODE PROJECTS</span></div>
          </div>
        </div>
        <div className="core-wrap">
          <div className="core-label top">MER23LIN AUTONOMOUS CORE // LIVE</div>
          <Suspense fallback={<div className="core-fallback">CORE INITIALIZING</div>}><NeuralScene /></Suspense>
          <div className="core-label bottom">DRAG TO INSPECT · NODE AMIRGH23</div>
        </div>
      </section>

      <section className="identity-deck" aria-labelledby="identity-title">
        <div className="identity-visual">
          <div className="portrait-frame">
            <img src="https://github.com/Amirgh23.png?size=600" alt="Amirreza Ghaffarian" />
            <div className="portrait-grid" /><div className="scan-beam" />
            <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
          </div>
          <div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" />
          <div className="biometric-tag">BIOMETRIC MATCH // 99.7%</div>
        </div>
        <motion.div className="identity-copy" initial={reduceMotion ? false : { opacity: 0, x: 35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span>00 // AUTHORIZED OPERATOR</span>
          <h2 id="identity-title">AMIRREZA<br /><em>GHAFFARIAN</em></h2>
          <p>AI agent engineer and full-stack developer connecting autonomous intelligence, data, frontend architecture and production web delivery.</p>
          <div className="identity-data">
            <div><small>PRIMARY ROLE</small><b>AI AGENT ENGINEER</b></div>
            <div><small>ENGINEERING MODE</small><b>FULL-STACK DEVELOPER</b></div>
            <div><small>ACADEMIC CORE</small><b>M.Sc. AI &amp; ROBOTICS · 2026</b></div>
            <div><small>STATUS</small><b className="online">● OPERATIONAL</b></div>
          </div>
          <div className="identity-links">
            <a href="https://github.com/Amirgh23" target="_blank" rel="noreferrer">OPEN GITHUB <Github /></a>
            <a href="https://jobinja.ir/user/NL-1212752" target="_blank" rel="noreferrer">SOURCE RESUME <Briefcase /></a>
          </div>
        </motion.div>
      </section>

      <section id="systems" className="systems">
        <div className="section-head"><span>01 // ENGINEERING SYSTEMS</span><h2>CAPABILITY GRID</h2></div>
        <div className="system-grid">{capabilityModules.map(([name, description, signal], index) => <motion.article key={name} initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
          <small>MOD-{String(index + 1).padStart(2, '0')} // {signal}</small><h3>{name}</h3><p>{description}</p><div className="module-signal"><i /><i /><i /><i className={signal === 'WORKING' ? '' : 'active'} /></div>
        </motion.article>)}</div>
      </section>

      <section id="skills" className="stack-matrix">
        <div className="section-head"><span>02 // VERIFIED TOOLCHAIN</span><h2>FULL-STACK SKILL MATRIX</h2></div>
        <div className="stack-summary">
          <div><Code2 /><b>FRONTEND</b><span>5+ YEARS</span></div>
          <div><Database /><b>FULL STACK</b><span>DATA + APIs</span></div>
          <div><Globe2 /><b>WEB DELIVERY</b><span>15+ COMPANIES</span></div>
        </div>
        <div className="skill-console" role="table" aria-label="Engineering skills matrix">
          <div className="skill-row skill-head" role="row"><span role="columnheader">DOMAIN</span><span role="columnheader">SIGNAL</span><span role="columnheader">TOOLS &amp; TECHNOLOGIES</span></div>
          {skillGroups.map((group, index) => <motion.div className="skill-row" role="row" key={group.domain} initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 18 : -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <strong role="cell">{group.domain}</strong><b role="cell">{group.signal}</b><div role="cell">{group.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
          </motion.div>)}
        </div>
      </section>

      <section id="experience" className="experience-section">
        <div className="section-head"><span>03 // PROFESSIONAL TRAJECTORY</span><h2>EXPERIENCE LOG</h2></div>
        <div className="experience-layout">
          <div className="timeline">{experience.map((item, index) => <motion.article key={`${item.company}-${item.period}`} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="timeline-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="timeline-copy"><small>{item.period} // {item.location}</small><h3>{item.role}</h3><h4>{item.website ? <a href={item.website} target="_blank" rel="noreferrer">{item.company} <span>↗</span></a> : item.company}</h4><p>{item.description}</p><div>{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          </motion.article>)}</div>
          <aside className="career-side">
            <div className="career-stat"><Globe2 /><b>15+</b><span>COMPANIES COLLABORATED WITH ACROSS AUSTRALIA, USA &amp; IRAN</span></div>
            <div className="career-stat"><Code2 /><b>10+</b><span>SMALL PROGRAMMING PROJECTS DELIVERED IN THE LAST TWO YEARS</span></div>
            <div className="education-card"><GraduationCap /><small>ACADEMIC CHANNEL</small><h3>M.Sc. AI &amp; ROBOTICS</h3><p>Islamic Azad University, Mashhad</p><b>COMPLETED // 2026</b><hr /><h4>B.Sc. Computer Engineering — AI</h4><p>Quchan University of Technology · 2017–2023</p></div>
            <div className="early-log"><small>EARLIER SYSTEM LOG</small><p><b>2025</b> ATP Glass · WordPress commerce</p><p><b>2024</b> Ajandam Toos · WordPress commerce</p><p><b>2019</b> Parsan · Game UI &amp; image processing</p><p><b>2018</b> Septak · MikroTik ATM networks</p></div>
          </aside>
        </div>
      </section>

      <section id="projects" className="projects">
        <div className="section-head"><span>04 // COMPLETE REPOSITORY NETWORK</span><h2>ALL PUBLIC NODES</h2></div>
        <div className="repo-toolbar"><label><span>SEARCH NETWORK</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="TYPE NAME, LANGUAGE OR CAPABILITY..." /></label><div><b>{filteredProjects.length}</b><span> / {projects.length} NODES VISIBLE</span></div></div>
        <div className="project-map">{filteredProjects.map((project, index) => <motion.a href={project.url} target="_blank" rel="noreferrer" key={project.id} style={{ '--node': project.color }} whileHover={reduceMotion ? {} : { y: -8 }}>
          <div className="node-orbit"><i /><b>{project.id}</b></div><small>{project.type}</small><h3>{project.title}</h3><p>{project.description}</p><div className="repo-meta"><span>{project.language}</span><span>★ {project.stars}</span></div><strong>ACCESS REPOSITORY ↗</strong><em>{String(index + 1).padStart(2, '0')}</em>
        </motion.a>)}</div>
        {filteredProjects.length === 0 && <div className="empty-network">NO MATCHING NODE // MODIFY SEARCH SIGNAL</div>}
      </section>

      <section className="manifesto"><Radio /><p>THE FUTURE IS NOT PREDICTED.</p><h2>IT IS ENGINEERED.</h2><span>— AMIRGH23 // MER23LIN</span></section>
    </main>

    <footer id="contact">
      <div><b>ESTABLISH UPLINK</b><span>Available for AI, full-stack, frontend and ambitious web collaborations.</span></div>
      <div className="socials"><a href="https://github.com/Amirgh23" target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a><a href="https://www.linkedin.com/in/amirreza-ghaffarian-nokhodi-55371020b" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a></div>
      <div className="contact-channels"><a href="tel:+989152389023" aria-label="Call +98 915 238 9023"><Phone /><span><i>DIRECT LINE</i><strong>+98 915 238 9023</strong></span></a><a href="https://t.me/ARGHN23" target="_blank" rel="noreferrer" aria-label="Telegram ARGHN23"><Send /><span><i>TELEGRAM</i><strong>@ARGHN23</strong></span></a><a href="https://www.instagram.com/amir_.gh23" target="_blank" rel="noreferrer" aria-label="Instagram amir_.gh23"><Instagram /><span><i>INSTAGRAM</i><strong>@amir_.gh23</strong></span></a></div>
      <small>© 2026 AMIRGH23 · MER23LIN OMEGA CHANNEL</small>
    </footer>
    <Terminal open={terminal} onClose={() => setTerminal(false)} />
  </>;
}
