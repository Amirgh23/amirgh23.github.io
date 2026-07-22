import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, OrbitControls, Stars } from '@react-three/drei';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Power, Radio, Terminal as TerminalIcon, Volume2, VolumeX } from 'lucide-react';
import * as THREE from 'three';

const projects = [
  { id: 'R-01', title: 'LOCAL RAG CLASSROOM', type: 'KNOWLEDGE RETRIEVAL', tech: 'PYTHON · RAG · LOCAL AI', url: 'https://github.com/Amirgh23/rag-class-project', color: '#00f7ff' },
  { id: 'L-02', title: 'PERSIAN GPT-2 QA', type: 'LANGUAGE INTELLIGENCE', tech: 'TRANSFORMERS · PERSIAN NLP', url: 'https://github.com/Amirgh23/persian-gpt2-qa', color: '#ff2bd6' },
  { id: 'A-03', title: 'VGAR-PPO', type: 'ADAPTIVE POLICY ENGINE', tech: 'PYTORCH · RL · GYMNASIUM', url: 'https://github.com/Amirgh23/vgar-ppo', color: '#8b5cf6' },
  { id: 'O-04', title: 'PC-EHOA', type: 'OPTIMIZATION SENTINEL', tech: 'FEATURE SELECTION · ABLATION', url: 'https://github.com/Amirgh23/pc-ehoa-feature-selection', color: '#ff304f' }
];

function BootScreen({ onComplete }) {
  const [line, setLine] = useState(0);
  const logs = ['INITIALIZING AMIRGH23 KERNEL', 'MOUNTING VECTOR MEMORY', 'LINKING AUTONOMOUS AGENTS', 'CALIBRATING NEURAL CORE', 'SECURE CHANNEL ESTABLISHED'];
  useEffect(() => { const timer = setInterval(() => setLine((v) => { if (v >= logs.length) { clearInterval(timer); setTimeout(onComplete, 350); return v; } return v + 1; }), 260); return () => clearInterval(timer); }, [onComplete]);
  return <motion.div className="boot" exit={{ opacity: 0 }} transition={{ duration: .5 }}><div className="boot-box"><div className="boot-mark">NN<span>/</span>23</div>{logs.slice(0, line).map((log, i) => <p key={log}><span>{String(i + 1).padStart(2, '0')}</span> {log} <b>OK</b></p>)}<div className="boot-progress"><i style={{ width: `${Math.min(line / logs.length * 100, 100)}%` }} /></div><small>OMEGA CLEARANCE REQUIRED // AUTHORIZED NODE DETECTED</small></div></motion.div>;
}

function CoreMesh() {
  const group = useRef();
  const particles = useMemo(() => Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2; const radius = 2.2 + (i % 3) * .45; return [Math.cos(a) * radius, Math.sin(a * 2) * .55, Math.sin(a) * radius]; }), []);
  useFrame((state, delta) => { if (group.current) { group.current.rotation.y += delta * .13; group.current.rotation.x = Math.sin(state.clock.elapsedTime * .25) * .08; } });
  return <group ref={group}><Float speed={1.5} rotationIntensity={.4} floatIntensity={.5}><mesh><icosahedronGeometry args={[1.15, 2]} /><meshStandardMaterial color="#06101f" emissive="#00f7ff" emissiveIntensity={1.8} wireframe /></mesh><mesh><icosahedronGeometry args={[.66, 1]} /><meshStandardMaterial color="#ff2bd6" emissive="#8b5cf6" emissiveIntensity={2.5} /></mesh></Float>{particles.map((p, i) => <group key={i}><mesh position={p}><sphereGeometry args={[.055, 8, 8]} /><meshBasicMaterial color={i % 2 ? '#ff2bd6' : '#00f7ff'} /></mesh><Line points={[[0, 0, 0], p]} color={i % 2 ? '#8b5cf6' : '#00f7ff'} opacity={.2} transparent lineWidth={.5} /></group>)}</group>;
}

function NeuralScene() {
  return <Canvas camera={{ position: [0, 0, 7], fov: 44 }} dpr={[1, 1.5]}><ambientLight intensity={.35} /><pointLight position={[3, 3, 4]} color="#00f7ff" intensity={15} /><pointLight position={[-4, -2, 2]} color="#ff2bd6" intensity={12} /><Stars radius={25} depth={15} count={700} factor={2} fade speed={.35} /><CoreMesh /><OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={.35} /></Canvas>;
}

function DataRain() {
  const canvasRef = useRef();
  useEffect(() => { const canvas = canvasRef.current; const ctx = canvas.getContext('2d'); let frame; const chars = '01AIΩ∆RAGMCP//'; let drops = [];
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; drops = Array(Math.ceil(innerWidth / 24)).fill(0).map(() => Math.random() * -40); }; resize(); addEventListener('resize', resize);
    const draw = () => { ctx.fillStyle = 'rgba(2,3,10,.08)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.font = '12px monospace'; drops.forEach((y, i) => { ctx.fillStyle = i % 7 ? 'rgba(0,247,255,.16)' : 'rgba(255,43,214,.18)'; ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 24, y * 18); drops[i] = y * 18 > canvas.height && Math.random() > .985 ? 0 : y + .45; }); frame = requestAnimationFrame(draw); }; draw(); return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); }; }, []);
  return <canvas className="data-rain" ref={canvasRef} aria-hidden="true" />;
}

function Terminal({ open, onClose }) {
  const [history, setHistory] = useState([{ type: 'sys', text: 'NEURAL NEXUS terminal online. Type help.' }]); const [input, setInput] = useState('');
  const run = (event) => { event.preventDefault(); const command = input.trim().toLowerCase(); const output = { help: 'COMMANDS: about · projects · skills · contact · clear', about: 'AMIRGH23 // Autonomous Intelligence Architect // Mashhad, Iran', projects: projects.map(p => `${p.id}: ${p.title}`).join('  |  '), skills: 'LLM · AGENTS · RAG · VISION · REINFORCEMENT LEARNING · REACT', contact: 'GITHUB: github.com/Amirgh23  //  LINKEDIN UPLINK AVAILABLE' }[command] || `UNKNOWN COMMAND: ${command || '[EMPTY]'}`; setHistory(command === 'clear' ? [] : [...history, { type: 'cmd', text: `> ${input}` }, { type: 'out', text: output }]); setInput(''); };
  return <AnimatePresence>{open && <motion.div className="terminal-shell" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} role="dialog" aria-label="Neural Nexus terminal"><div className="terminal-bar"><span>TERMINAL://AMIRGH23</span><button onClick={onClose} aria-label="Close terminal">×</button></div><div className="terminal-output">{history.map((item, i) => <p className={item.type} key={i}>{item.text}</p>)}</div><form onSubmit={run}><span>Ω</span><input autoFocus value={input} onChange={(e) => setInput(e.target.value)} aria-label="Terminal command" autoComplete="off" /></form></motion.div>}</AnimatePresence>;
}

export default function App() {
  const [booted, setBooted] = useState(false); const [terminal, setTerminal] = useState(false); const [audio, setAudio] = useState(false); const reduceMotion = useReducedMotion();
  useEffect(() => { const move = (e) => { document.documentElement.style.setProperty('--mx', `${(e.clientX / innerWidth - .5) * 16}px`); document.documentElement.style.setProperty('--my', `${(e.clientY / innerHeight - .5) * 16}px`); }; addEventListener('pointermove', move); return () => removeEventListener('pointermove', move); }, []);
  return <><AnimatePresence>{!booted && <BootScreen onComplete={() => setBooted(true)} />}</AnimatePresence><DataRain /><div className="scanlines" aria-hidden="true" />
    <header><a href="#top" className="brand">AMIRGH23<span>//NEURAL NEXUS</span></a><nav><a href="#systems">SYSTEMS</a><a href="#projects">NODES</a><a href="#contact">UPLINK</a></nav><div className="controls"><button onClick={() => setAudio(!audio)} aria-label={audio ? 'Disable interface audio' : 'Enable interface audio'}>{audio ? <Volume2 /> : <VolumeX />}</button><button onClick={() => setTerminal(true)} aria-label="Open terminal"><TerminalIcon /></button></div></header>
    <main id="top"><section className="hero"><div className="hero-copy"><div className="eyebrow"><span /> NETWORK STATUS: ONLINE</div><h1>ENGINEERING<br /><em>INTELLIGENCE</em><br />BEYOND LIMITS.</h1><p>Autonomous agents. Neural systems. Machines that perceive, reason and act.</p><div className="hero-actions"><a href="#projects">ENTER THE NEXUS <Power /></a><button onClick={() => setTerminal(true)}>OPEN TERMINAL <TerminalIcon /></button></div><div className="metrics"><div><b>16</b><span>PUBLIC NODES</span></div><div><b>Ω</b><span>CLEARANCE</span></div><div><b>94%</b><span>CORE SYNC</span></div></div></div><div className="core-wrap"><div className="core-label top">AUTONOMOUS CORE // LIVE</div><Suspense fallback={<div className="core-fallback">CORE INITIALIZING</div>}><NeuralScene /></Suspense><div className="core-label bottom">DRAG TO INSPECT · NODE AMIRGH23</div></div></section>
    <section id="systems" className="systems"><div className="section-head"><span>01 // SYSTEM ARCHITECTURE</span><h2>NEURAL CAPABILITY GRID</h2></div><div className="system-grid">{[['LLM ENGINEERING','Transformer systems, evaluation and local inference','86'],['AGENT NETWORKS','Tool use, orchestration and persistent memory','82'],['RAG ARCHITECTURE','Grounded retrieval and vector intelligence','81'],['VISION SYSTEMS','VLM, OCR and perception pipelines','72'],['REINFORCEMENT','Adaptive policies and validation-aware learning','79'],['INTERFACE SYSTEMS','React, TypeScript and high-density control surfaces','84']].map(([name, desc, level], i) => <motion.article key={name} initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }}><small>MOD-{String(i + 1).padStart(2,'0')} // OPERATIONAL</small><h3>{name}</h3><p>{desc}</p><div className="level"><i style={{ width: `${level}%` }} /><span>{level}</span></div></motion.article>)}</div></section>
    <section id="projects" className="projects"><div className="section-head"><span>02 // ACTIVE NODES</span><h2>DEPLOYED INTELLIGENCE</h2></div><div className="project-map">{projects.map((project, i) => <motion.a href={project.url} target="_blank" rel="noreferrer" key={project.id} style={{ '--node': project.color }} whileHover={reduceMotion ? {} : { y: -8 }}><div className="node-orbit"><i /><b>{project.id}</b></div><small>{project.type}</small><h3>{project.title}</h3><p>{project.tech}</p><span>ACCESS REPOSITORY ↗</span><em>0{i + 1}</em></motion.a>)}</div></section>
    <section className="manifesto"><Radio /><p>THE FUTURE IS NOT PREDICTED.</p><h2>IT IS ENGINEERED.</h2><span>— AMIRGH23 // NEURAL NEXUS</span></section></main>
    <footer id="contact"><div><b>ESTABLISH UPLINK</b><span>Available for research, collaboration and ambitious engineering.</span></div><div className="socials"><a href="https://github.com/Amirgh23" aria-label="GitHub"><Github /></a><a href="https://www.linkedin.com/in/amirreza-ghaffarian-nokhodi-55371020b" aria-label="LinkedIn"><Linkedin /></a></div><small>© 2026 AMIRGH23 · OMEGA CHANNEL</small></footer><Terminal open={terminal} onClose={() => setTerminal(false)} /></>;
}
