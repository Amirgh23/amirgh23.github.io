import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Stars } from '@react-three/drei';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Briefcase, Code2, Github, GraduationCap,
  Instagram, Linkedin, Menu, Phone, Send, Terminal as TerminalIcon, Volume2, VolumeX, X,
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
  const ready = step >= 5;
  const lines = ['WAKE NEURAL FACILITY', 'SYNC AUTONOMOUS CORE', 'MAP PROJECT VAULT', 'VERIFY OPERATOR', 'OPEN VISITOR CHANNEL'];
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
      <div className="boot__readout">NEURAL FACILITY // VISITOR BOOT</div>
      {lines.map((line, index) => <p key={line} className={index < step ? 'is-ready' : ''}><b>0{index + 1}</b>{line}<span>{index < step ? 'ONLINE' : 'WAIT'}</span></p>)}
      <div className="boot__bar"><i style={{ width: `${step / lines.length * 100}%` }} /></div>
      {ready ? <div className="boot__entry" role="dialog" aria-modal="true" aria-label="Enter portfolio with background music"><b>SYSTEM READY</b><p>BACKGROUND AUDIO WILL START ON ENTRY</p><button type="button" onClick={() => { window.dispatchEvent(new Event('mer23lin:enter')); done(); }}><Volume2 /> ENTER WITH SOUND</button></div> : <small>INITIALIZING VISITOR CHANNEL...</small>}
    </div>
  </motion.div>;
}

function CyberBuilding({ building, index }) {
  const { x, z, width, depth, height, color, side } = building;
  const frontX = x + (side < 0 ? width / 2 + .012 : -width / 2 - .012);
  const faceRotation = side < 0 ? Math.PI / 2 : -Math.PI / 2;
  return <group>
    <mesh position={[x, -3.45 + height / 2, z]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={index % 3 ? '#050816' : '#090817'} metalness={.74} roughness={.48} emissive="#050711" emissiveIntensity={.7} />
    </mesh>
    <mesh position={[frontX, -3.25 + height * .53, z]} rotation={[0, faceRotation, 0]}>
      <planeGeometry args={[depth * .72, height * .62]} />
      <meshBasicMaterial color={color} transparent opacity={.12 + (index % 4) * .025} />
    </mesh>
    {Array.from({ length: Math.min(7, Math.max(3, Math.floor(height / 1.8))) }, (_, row) => <mesh key={row} position={[frontX + (side < 0 ? .006 : -.006), -2.8 + row * 1.15, z]} rotation={[0, faceRotation, 0]}>
      <planeGeometry args={[depth * .62, .035]} />
      <meshBasicMaterial color={row % 3 === 0 ? color : '#5174a5'} transparent opacity={row % 3 === 0 ? .9 : .34} />
    </mesh>)}
    {index % 4 === 0 && <mesh position={[frontX + (side < 0 ? .02 : -.02), -2.25 + height * .45, z + depth * .12]} rotation={[0, faceRotation, 0]}>
      <planeGeometry args={[Math.min(2.2, depth * .62), .72]} />
      <meshBasicMaterial color={color} transparent opacity={.9} />
    </mesh>}
    {index % 3 === 0 && <mesh position={[x, -3.25 + height + .7, z]}><cylinderGeometry args={[.025, .025, 1.4, 5]} /><meshBasicMaterial color={color} /></mesh>}
  </group>;
}

function RoadTraffic({ offset, lane, color, speed = 1, reduced }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.position.z = 8 - ((state.clock.elapsedTime * speed * 8 + offset) % 68);
  });
  return <group ref={ref} position={[lane, -3.34, 8 - offset]}>
    <mesh><boxGeometry args={[.08, .018, 1.8]} /><meshBasicMaterial color={color} transparent opacity={.85} /></mesh>
  </group>;
}

function FlyingVehicle({ position, color, speed, reverse = false, reduced }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current || reduced) return;
    const travel = (state.clock.elapsedTime * speed + position[2] * .2) % 58;
    ref.current.position.z = reverse ? -48 + travel : 9 - travel;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * .8 + position[0]) * .12;
  });
  return <group ref={ref} position={position}>
    <mesh><boxGeometry args={[.72, .16, 1.3]} /><meshStandardMaterial color="#050711" metalness={.9} roughness={.2} /></mesh>
    <mesh position={[-.38, 0, reverse ? -.32 : .32]}><sphereGeometry args={[.055, 6, 6]} /><meshBasicMaterial color={color} /></mesh>
    <mesh position={[.38, 0, reverse ? -.32 : .32]}><sphereGeometry args={[.055, 6, 6]} /><meshBasicMaterial color={color} /></mesh>
  </group>;
}

function FighterCraft({ color, accent, mirrored = false }) {
  return <group rotation={[0, mirrored ? Math.PI : 0, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[.34, 1.55, 5]} /><meshStandardMaterial color="#070914" metalness={.94} roughness={.16} emissive={color} emissiveIntensity={.22} /></mesh>
    <mesh position={[0, .03, .12]}><boxGeometry args={[1.55, .055, .48]} /><meshStandardMaterial color="#090c18" metalness={.92} roughness={.18} /></mesh>
    <mesh position={[0, .17, -.12]}><sphereGeometry args={[.19, 10, 8]} /><meshBasicMaterial color={accent} transparent opacity={.8} /></mesh>
    <mesh position={[-.54, .02, .45]}><boxGeometry args={[.07, .07, .55]} /><meshBasicMaterial color={color} /></mesh>
    <mesh position={[.54, .02, .45]}><boxGeometry args={[.07, .07, .55]} /><meshBasicMaterial color={color} /></mesh>
    <mesh position={[-.19, 0, .83]}><sphereGeometry args={[.075, 7, 7]} /><meshBasicMaterial color={accent} /></mesh>
    <mesh position={[.19, 0, .83]}><sphereGeometry args={[.075, 7, 7]} /><meshBasicMaterial color={accent} /></mesh>
  </group>;
}

function LaserBolt({ phase, direction = 1, color, reduced }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current || reduced) return;
    const cycle = (state.clock.elapsedTime * 1.35 + phase) % 1;
    ref.current.position.x = direction > 0 ? -3.1 + cycle * 6.2 : 3.1 - cycle * 6.2;
    ref.current.position.y = 2.45 + Math.sin(phase * 11 + state.clock.elapsedTime * .7) * .28;
    ref.current.position.z = direction > 0 ? -.8 + cycle * 1.7 : .8 - cycle * 1.7;
  });
  return <mesh ref={ref} position={[direction > 0 ? -3 : 3, 2.45, 0]}><boxGeometry args={[.72, .035, .035]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>;
}

function NeonDogfight({ reduced }) {
  const group = useRef(), cyanCraft = useRef(), pinkCraft = useRef(), blast = useRef(), blastMaterial = useRef();
  useFrame((state) => {
    if (!group.current || !cyanCraft.current || !pinkCraft.current || !blast.current || !blastMaterial.current) return;
    group.current.position.z = state.camera.position.z - 19;
    if (reduced) return;
    const time = state.clock.elapsedTime;
    cyanCraft.current.position.set(-2.65 + Math.sin(time * .78) * 1.15, 2.7 + Math.sin(time * 1.17) * .48, -.7 + Math.cos(time * .62) * 1.4);
    pinkCraft.current.position.set(2.65 + Math.cos(time * .72) * 1.15, 2.55 + Math.cos(time * 1.08) * .46, .8 + Math.sin(time * .58) * 1.5);
    cyanCraft.current.rotation.z = -.18 + Math.sin(time * .9) * .16;
    pinkCraft.current.rotation.z = .18 + Math.cos(time * .86) * .16;
    const impact = Math.max(0, Math.sin(time * 1.9 + .7));
    blast.current.scale.setScalar(.12 + impact * .42);
    blastMaterial.current.opacity = impact > .82 ? (impact - .82) * 2.8 : 0;
  });
  return <group ref={group} position={[0, 0, -19]}>
    <group ref={cyanCraft} position={[-2.65, 2.7, -.7]}><FighterCraft color="#00eaff" accent="#a9fbff" /></group>
    <group ref={pinkCraft} position={[2.65, 2.55, .8]}><FighterCraft color="#ff24c8" accent="#ff9ae8" mirrored /></group>
    {Array.from({ length: 8 }, (_, index) => <LaserBolt key={index} phase={index * .137} direction={index % 2 ? -1 : 1} color={index % 2 ? '#ff24c8' : '#00eaff'} reduced={reduced} />)}
    <mesh ref={blast} position={[.15, 2.55, .1]}><sphereGeometry args={[.48, 12, 8]} /><meshBasicMaterial ref={blastMaterial} color="#fff4b0" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
    <pointLight position={[0, 2.6, 0]} color="#ff7a2f" intensity={12} distance={7} />
  </group>;
}

function DroneSwarm({ reduced }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.z = state.camera.position.z - 13;
    if (!reduced) ref.current.rotation.y = state.clock.elapsedTime * .08;
  });
  return <group ref={ref} position={[0, 0, -13]}>{Array.from({ length: 6 }, (_, index) => {
    const angle = index / 6 * Math.PI * 2;
    return <group key={index} position={[Math.cos(angle) * (5.8 + index % 2), 4.1 + Math.sin(angle * 2) * 1.1, Math.sin(angle) * 3]}>
      <mesh><octahedronGeometry args={[.16, 0]} /><meshStandardMaterial color="#080b17" metalness={.9} emissive={index % 2 ? '#ff24c8' : '#00eaff'} emissiveIntensity={1.4} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.27, .018, 5, 14]} /><meshBasicMaterial color={index % 2 ? '#ff24c8' : '#00eaff'} transparent opacity={.72} /></mesh>
    </group>;
  })}</group>;
}

function NeonBillboard({ position, color, flip = false }) {
  return <group position={position} rotation={[0, flip ? -.3 : .3, 0]}>
    <mesh><boxGeometry args={[3.2, 1.45, .08]} /><meshStandardMaterial color="#050713" metalness={.78} roughness={.22} emissive={color} emissiveIntensity={.16} /></mesh>
    <mesh position={[0, 0, .05]}><planeGeometry args={[2.88, 1.15]} /><meshBasicMaterial color={color} transparent opacity={.13} /></mesh>
    {[-.34, 0, .34].map((y, index) => <mesh key={y} position={[index ? -.35 : .3, y, .065]}><boxGeometry args={[index === 1 ? 1.85 : 2.25, .035, .02]} /><meshBasicMaterial color={index === 1 ? '#ffffff' : color} transparent opacity={index === 1 ? .5 : .9} /></mesh>)}
    <pointLight position={[0, 0, 1]} color={color} intensity={5} distance={6} />
  </group>;
}

function CityRain({ reduced }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const data = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i += 1) {
      data[i * 3] = (Math.random() - .5) * 34;
      data[i * 3 + 1] = Math.random() * 18 - 5;
      data[i * 3 + 2] = -Math.random() * 62 + 8;
    }
    return data;
  }, []);
  useFrame((state) => { if (ref.current && !reduced) ref.current.position.y = -((state.clock.elapsedTime * 4) % 8); });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#9eefff" size={.025} transparent opacity={.34} depthWrite={false} /></points>;
}

function DataSpire({ item, index }) {
  const { x, z, height, width, color, lean } = item;
  return <group position={[x, -3.5 + height / 2, z]} rotation={[0, 0, lean]}>
    <mesh><boxGeometry args={[width, height, width * .72]} /><meshStandardMaterial color="#040611" metalness={.88} roughness={.3} emissive={color} emissiveIntensity={.08} /></mesh>
    <mesh position={[-Math.sign(x) * (width / 2 + .012), 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[width * .54, height * .82]} /><meshBasicMaterial color={color} transparent opacity={.08 + index % 3 * .025} /></mesh>
    {Array.from({ length: Math.min(9, Math.max(4, Math.floor(height / 1.45))) }, (_, row) => <mesh key={row} position={[-Math.sign(x) * (width / 2 + .02), -height * .34 + row * 1.05, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[width * .48, .035, .025]} /><meshBasicMaterial color={row % 3 ? '#3d5a86' : color} transparent opacity={row % 3 ? .34 : .92} /></mesh>)}
    <mesh position={[0, height / 2 + .4, 0]}><octahedronGeometry args={[.16 + index % 2 * .06, 0]} /><meshBasicMaterial color={color} /></mesh>
  </group>;
}

function NeonGateway({ z, index }) {
  const color = index % 2 ? '#ff24c8' : '#00eaff';
  return <group position={[0, 0, z]}>
    <mesh position={[-5.35, 1.35, 0]}><boxGeometry args={[.055, 8.7, .055]} /><meshBasicMaterial color={color} transparent opacity={.58} /></mesh>
    <mesh position={[5.35, 1.35, 0]}><boxGeometry args={[.055, 8.7, .055]} /><meshBasicMaterial color={color} transparent opacity={.58} /></mesh>
    <mesh position={[0, 5.7, 0]}><boxGeometry args={[10.7, .055, .055]} /><meshBasicMaterial color={color} transparent opacity={.58} /></mesh>
    <mesh position={[-4.9, 5.25, 0]} rotation={[0, 0, -.78]}><boxGeometry args={[1.25, .055, .055]} /><meshBasicMaterial color="#a879ff" /></mesh>
    <mesh position={[4.9, 5.25, 0]} rotation={[0, 0, .78]}><boxGeometry args={[1.25, .055, .055]} /><meshBasicMaterial color="#a879ff" /></mesh>
  </group>;
}

function DataRunner({ offset, lane, color, reduced }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.position.z = 7 - ((state.clock.elapsedTime * 13 + offset) % 70);
  });
  return <mesh ref={ref} position={[lane, -3.42, 7 - offset]}><boxGeometry args={[.028, .022, 2.6]} /><meshBasicMaterial color={color} transparent opacity={.84} /></mesh>;
}

function HolographicCore({ reduced }) {
  const ref = useRef(), inner = useRef();
  useFrame((state) => {
    if (!ref.current || !inner.current) return;
    ref.current.position.z = state.camera.position.z - 24;
    if (!reduced) {
      ref.current.rotation.y = state.clock.elapsedTime * .16;
      inner.current.rotation.set(state.clock.elapsedTime * .11, state.clock.elapsedTime * -.19, state.clock.elapsedTime * .08);
    }
  });
  return <group ref={ref} position={[0, 3.1, -24]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.3, .035, 8, 72]} /><meshBasicMaterial color="#00eaff" transparent opacity={.62} /></mesh>
    <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[1.78, .025, 8, 64]} /><meshBasicMaterial color="#ff24c8" transparent opacity={.72} /></mesh>
    <mesh ref={inner}><icosahedronGeometry args={[.92, 1]} /><meshBasicMaterial color="#b78cff" wireframe transparent opacity={.72} /></mesh>
    <mesh><sphereGeometry args={[.28, 16, 12]} /><meshBasicMaterial color="#ffffff" /></mesh>
    <pointLight color="#00eaff" intensity={24} distance={24} />
  </group>;
}

function DeskMonitor({ position, rotation = [0, 0, 0], color = '#00eaff', wide = false }) {
  const width = wide ? 5.2 : 3.75, height = wide ? 2.75 : 2.45;
  return <group position={position} rotation={rotation}>
    <mesh><boxGeometry args={[width + .22, height + .22, .18]} /><meshStandardMaterial color="#03050c" metalness={.9} roughness={.2} /></mesh>
    <mesh position={[0, 0, .101]}><planeGeometry args={[width, height]} /><meshBasicMaterial color="#020713" /></mesh>
    <mesh position={[0, height * .32, .112]}><planeGeometry args={[width * .84, .03]} /><meshBasicMaterial color={color} /></mesh>
    {Array.from({ length: 6 }, (_, index) => <mesh key={index} position={[-width * .12 + (index % 2) * width * .2, height * .14 - index * .16, .113]}><planeGeometry args={[width * (.42 - index % 3 * .06), .026]} /><meshBasicMaterial color={index % 3 === 0 ? '#ff24c8' : color} transparent opacity={.34 + index % 2 * .28} /></mesh>)}
    <mesh position={[width * .29, -height * .18, .113]}><planeGeometry args={[width * .22, height * .24]} /><meshBasicMaterial color={color} transparent opacity={.16} /></mesh>
    <mesh position={[0, -height / 2 - .55, -.05]}><boxGeometry args={[.16, .95, .16]} /><meshStandardMaterial color="#111726" metalness={.9} /></mesh>
    <mesh position={[0, -height / 2 - 1.02, .05]}><boxGeometry args={[1.45, .09, .62]} /><meshStandardMaterial color="#090d17" metalness={.88} /></mesh>
    <pointLight position={[0, 0, 1.2]} color={color} intensity={5} distance={5} />
  </group>;
}

function MechanicalKeyboard() {
  return <group position={[0, -1.58, -2.15]} rotation={[-.04, 0, 0]}>
    <mesh><boxGeometry args={[4.6, .18, 1.48]} /><meshStandardMaterial color="#050711" metalness={.82} roughness={.3} /></mesh>
    {Array.from({ length: 48 }, (_, index) => {
      const row = Math.floor(index / 12), column = index % 12;
      return <mesh key={index} position={[-1.98 + column * .36, .115, -.52 + row * .34]}><boxGeometry args={[.29, .075, .25]} /><meshStandardMaterial color="#11172a" emissive={(row + column) % 4 === 0 ? '#ff24c8' : '#00eaff'} emissiveIntensity={.55} /></mesh>;
    })}
    <mesh position={[0, .13, .68]}><boxGeometry args={[2.15, .055, .035]} /><meshBasicMaterial color="#895cff" /></mesh>
  </group>;
}

function RgbFan({ y, color, reduced, speed }) {
  const blades = useRef();
  useFrame((state) => { if (blades.current && !reduced) blades.current.rotation.z = state.clock.elapsedTime * speed; });
  return <group position={[0, y, 0]}>
    <mesh><torusGeometry args={[.46, .035, 7, 28]} /><meshBasicMaterial color={color} /></mesh>
    <group ref={blades}>
      {Array.from({ length: 5 }, (_, blade) => <mesh key={blade} rotation={[0, 0, blade / 5 * Math.PI * 2]} position={[.22, 0, 0]}><boxGeometry args={[.36, .055, .025]} /><meshBasicMaterial color={color} transparent opacity={.45} /></mesh>)}
    </group>
  </group>;
}

function RgbTower({ reduced }) {
  return <group position={[5.1, -.15, -4.85]}>
    <mesh><boxGeometry args={[2.15, 4.8, 2.5]} /><meshStandardMaterial color="#03050c" metalness={.86} roughness={.2} transparent opacity={.92} /></mesh>
    <mesh position={[-1.085, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[2.2, 4.4]} /><meshBasicMaterial color="#00eaff" transparent opacity={.07} /></mesh>
    <group position={[0, .25, 1.27]}>
      <RgbFan y={1.15} color="#00eaff" reduced={reduced} speed={1.6} />
      <RgbFan y={0} color="#ff24c8" reduced={reduced} speed={-1.35} />
      <RgbFan y={-1.15} color="#00eaff" reduced={reduced} speed={1.48} />
    </group>
    <mesh position={[0, -2.3, 1.29]}><boxGeometry args={[1.75, .035, .03]} /><meshBasicMaterial color="#895cff" /></mesh>
  </group>;
}

function DeskHologram({ reduced }) {
  const ref = useRef();
  useFrame((state) => { if (ref.current && !reduced) ref.current.rotation.y = state.clock.elapsedTime * .42; });
  return <group position={[-3.55, -.86, -3.25]}>
    <mesh><cylinderGeometry args={[.72, .86, .18, 24]} /><meshStandardMaterial color="#07101b" metalness={.9} emissive="#00eaff" emissiveIntensity={.28} /></mesh>
    <group ref={ref} position={[0, 1.25, 0]}>
      <mesh><icosahedronGeometry args={[.72, 1]} /><meshBasicMaterial color="#00eaff" wireframe transparent opacity={.76} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.05, .022, 7, 48]} /><meshBasicMaterial color="#ff24c8" /></mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[.9, .018, 7, 44]} /><meshBasicMaterial color="#895cff" /></mesh>
    </group>
    <pointLight position={[0, 1.2, 0]} color="#00eaff" intensity={15} distance={8} />
  </group>;
}

function NeonCable({ points, color }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))), [points]);
  return <mesh><tubeGeometry args={[curve, 48, .022, 7, false]} /><meshBasicMaterial color={color} transparent opacity={.7} /></mesh>;
}

function DeskDust({ reduced }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const data = new Float32Array(420 * 3);
    for (let index = 0; index < 420; index += 1) { data[index * 3] = (Math.random() - .5) * 20; data[index * 3 + 1] = Math.random() * 9 - 2.5; data[index * 3 + 2] = -Math.random() * 14 + 3; }
    return data;
  }, []);
  useFrame((state) => { if (ref.current && !reduced) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * .08) * .035; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#9fefff" size={.02} transparent opacity={.28} depthWrite={false} /></points>;
}

function NightCity({ active, reduced, travel }) {
  const rig = useRef();
  const cameraTargets = [[0, .85], [1.15, 1.05], [-1.05, 1.25], [.82, .72], [-.88, .78], [.68, 1.15], [0, .92]];
  useFrame((state) => {
    const target = reduced ? cameraTargets[0] : cameraTargets[active];
    const journey = reduced ? active / (stations.length - 1) : travel.current;
    const targetZ = 8.8 - journey * 4.25;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, target[0], .03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, target[1], .03);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, .045);
    state.camera.lookAt(target[0] * .08, -.55, -5.1);
    if (rig.current) rig.current.position.x = THREE.MathUtils.lerp(rig.current.position.x, (active - 3) * -.06, .025);
  });
  return <group ref={rig}>
    <fog attach="fog" args={['#03020a', 11, 31]} />
    <ambientLight color="#263d75" intensity={.5} />
    <hemisphereLight color="#3158a6" groundColor="#a90d72" intensity={.62} />
    <pointLight position={[-6, 4, -3]} color="#00eaff" intensity={30} distance={24} />
    <pointLight position={[6, 1, -5]} color="#ff24c8" intensity={34} distance={25} />
    <mesh position={[0, 1.2, -10.8]}><planeGeometry args={[22, 11]} /><meshStandardMaterial color="#03040b" metalness={.72} roughness={.44} /></mesh>
    <mesh position={[0, 1.6, -10.68]}><planeGeometry args={[15.6, 7]} /><meshBasicMaterial color="#14092a" transparent opacity={.72} /></mesh>
    {Array.from({ length: 14 }, (_, index) => <mesh key={index} position={[-7.2 + index * 1.1, -1.05 + index % 4 * .5, -10.56]}><boxGeometry args={[.72, 1.4 + index % 5 * .55, .08]} /><meshBasicMaterial color={index % 3 === 0 ? '#ff24c8' : '#00eaff'} transparent opacity={.12 + index % 2 * .08} /></mesh>)}
    <mesh position={[0, -2.04, -4.8]}><boxGeometry args={[14.7, .42, 6.4]} /><meshStandardMaterial color="#050711" metalness={.9} roughness={.22} /></mesh>
    <mesh position={[0, -1.82, -4.8]}><boxGeometry args={[14.35, .035, 6.05]} /><meshBasicMaterial color="#111a2d" /></mesh>
    <mesh position={[0, -2.28, -4.8]}><boxGeometry args={[13.8, .04, 5.7]} /><meshBasicMaterial color="#ff24c8" transparent opacity={.58} /></mesh>
    <mesh position={[-6.2, -4.1, -4.8]}><boxGeometry args={[.5, 4.1, 1.1]} /><meshStandardMaterial color="#080b14" metalness={.85} /></mesh>
    <mesh position={[6.2, -4.1, -4.8]}><boxGeometry args={[.5, 4.1, 1.1]} /><meshStandardMaterial color="#080b14" metalness={.85} /></mesh>
    <DeskMonitor position={[0, .18, -6.35]} color="#00eaff" wide />
    <DeskMonitor position={[-4.25, .08, -6.15]} rotation={[0, .28, 0]} color="#ff24c8" />
    <DeskMonitor position={[4.05, .14, -6.4]} rotation={[0, -.28, 0]} color="#895cff" />
    <MechanicalKeyboard />
    <RgbTower reduced={reduced} />
    <DeskHologram reduced={reduced} />
    <NeonCable points={[[-2.1,-1.76,-2.8],[-2.7,-1.7,-3.6],[-1.9,-1.72,-5.4],[0,-1.75,-6.2]]} color="#00eaff" />
    <NeonCable points={[[2.25,-1.76,-2.65],[3.1,-1.68,-3.3],[2.6,-1.72,-4.7],[4.8,-1.7,-5.2]]} color="#ff24c8" />
    <DeskDust reduced={reduced} />
  </group>;
}

function JourneyZone({ index, z }) {
  const cyan = '#00eaff', pink = '#ff24c8', violet = '#9b6cff', green = '#42ff9e';
  if (index === 0) return <group position={[0, 0, z]}>
    <NeonGateway z={0} index={0} />
    {Array.from({ length: 14 }, (_, i) => <CyberBuilding key={i} index={i} building={{ x: (i % 2 ? 1 : -1) * (5.8 + i % 3 * 1.25), z: -8 + Math.floor(i / 2) * 2.4, width: 1.2 + i % 3 * .3, depth: 1.5, height: 3.8 + i % 5 * 1.2, color: i % 3 ? cyan : pink, side: i % 2 ? 1 : -1 }} />)}
    <NeonBillboard position={[-5.4, 1.25, -5]} color={pink} />
    <NeonBillboard position={[5.2, 2.1, -10]} color={cyan} flip />
  </group>;
  if (index === 1) return <group position={[0, 0, z]}>
    {[-7,-3.5,0,3.5,7].map((offset, i) => <group key={offset} position={[0, 0, offset]}><NeonGateway z={0} index={i + 1} /></group>)}
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[(i % 2 ? 1 : -1) * (3.8 + i % 3 * .75), -.35 + i % 3 * 1.4, -5 + i * 1.05]} rotation={[.18 * i,.22 * i,.08 * i]}><boxGeometry args={[1.15,1.15,1.15]} /><meshStandardMaterial color="#050817" emissive={i % 2 ? pink : cyan} emissiveIntensity={.45} metalness={.9} roughness={.18} wireframe /></mesh>)}
  </group>;
  if (index === 2) return <group position={[0, 1.15, z]}>
    {[0,1,2,3].map((ring) => <mesh key={ring} rotation={[ring % 2 ? Math.PI / 2 : 0, ring * .55, ring * .2]}><torusGeometry args={[2.1 + ring * .55,.035,8,72]} /><meshBasicMaterial color={ring % 2 ? pink : cyan} transparent opacity={.75 - ring * .1} /></mesh>)}
    <mesh><icosahedronGeometry args={[1.35,2]} /><meshStandardMaterial color="#060a18" emissive={violet} emissiveIntensity={1.4} metalness={.92} roughness={.16} wireframe /></mesh>
    {Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2;return <mesh key={i} position={[Math.cos(a)*4,Math.sin(a*2)*1.4,Math.sin(a)*4]}><sphereGeometry args={[.09,8,8]} /><meshBasicMaterial color={i%2?pink:cyan} /></mesh>;})}
  </group>;
  if (index === 3) return <group position={[0, 0, z]}>
    {Array.from({ length: 22 }, (_, i) => <DataSpire key={i} index={i} item={{ x:(i%2?1:-1)*(3.6+i%5*.72), z:-9+Math.floor(i/2)*1.75, height:3.4+i%6*1.1, width:.38+i%3*.14, color:i%3===0?pink:i%3===1?cyan:violet, lean:(i%2?1:-1)*.025*(i%3) }} />)}
    <group position={[0,2.2,-4]}><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[2.1,.035,8,64]} /><meshBasicMaterial color={cyan} /></mesh><mesh rotation={[0,Math.PI/2,0]}><torusGeometry args={[1.55,.028,8,56]} /><meshBasicMaterial color={pink} /></mesh><mesh><icosahedronGeometry args={[.82,1]} /><meshBasicMaterial color={violet} wireframe /></mesh><pointLight color={cyan} intensity={22} distance={18} /></group>
  </group>;
  if (index === 4) return <group position={[0, 0, z]}>
    {Array.from({length:9},(_,i)=><group key={i} position={[0,0,-10+i*2.5]}><NeonGateway z={0} index={i} /><mesh position={[0,5.7,.02]}><boxGeometry args={[2.4,.11,.05]} /><meshBasicMaterial color={i%2?green:pink} /></mesh></group>)}
    {Array.from({length:18},(_,i)=><mesh key={i} position={[(i%2?1:-1)*4.5,-1.35,-10+i*1.25]}><sphereGeometry args={[.12,8,8]} /><meshBasicMaterial color={i%2?cyan:pink} /></mesh>)}
  </group>;
  if (index === 5) return <group position={[0, .45, z]}>
    {Array.from({length:18},(_,i)=>{const angle=i*.92, radius=2.4+(i%4)*1.15, point=[Math.cos(angle)*radius,Math.sin(angle*1.7)*2.8,-7+i*.78];return <group key={i}><mesh position={point}><octahedronGeometry args={[.16+i%3*.07,0]} /><meshStandardMaterial color="#060914" emissive={i%2?pink:cyan} emissiveIntensity={1.8} metalness={.85} /></mesh><Line points={[[0,0,-2],point]} color={i%3===0?violet:i%2?pink:cyan} opacity={.28} transparent lineWidth={.45} /></group>;})}
    <mesh position={[0,0,-2]}><dodecahedronGeometry args={[1.15,1]} /><meshBasicMaterial color={violet} wireframe transparent opacity={.8} /></mesh>
  </group>;
  return <group position={[0, 1, z]}>
    {[0,1,2,3,4].map((ring)=><mesh key={ring} rotation={[ring*.23,ring*.41,ring*.16]}><torusGeometry args={[1.7+ring*.72,.045,8,80]} /><meshBasicMaterial color={ring%2?pink:cyan} transparent opacity={.88-ring*.11} /></mesh>)}
    <mesh><sphereGeometry args={[.72,24,16]} /><meshBasicMaterial color="#ffffff" /></mesh>
    <pointLight color={cyan} intensity={45} distance={24} />
    <Stars radius={18} depth={12} count={650} factor={2.5} fade speed={.35} />
  </group>;
}

function JourneyWorld({ active, reduced, travel }) {
  const rig = useRef(), orbit = useRef();
  const zoneGap = 28;
  useFrame((state) => {
    const journey = reduced ? active / (stations.length - 1) : travel.current;
    const targetZ = 8 - journey * zoneGap * (stations.length - 1);
    const sway = reduced ? 0 : Math.sin(journey * Math.PI * 6) * .72;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, sway, .045);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, .75 + Math.sin(journey * Math.PI * 4) * .22, .045);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, .06);
    state.camera.lookAt(sway * .12, -.35, targetZ - 12);
    if (rig.current) rig.current.position.x = THREE.MathUtils.lerp(rig.current.position.x, -sway * .18, .035);
    if (orbit.current && !reduced) orbit.current.rotation.y = state.clock.elapsedTime * .12;
  });
  return <group ref={rig}>
    <fog attach="fog" args={['#02030b', 9, 29]} />
    <ambientLight color="#263d75" intensity={.55} />
    <hemisphereLight color="#3158a6" groundColor="#a90d72" intensity={.65} />
    <pointLight position={[-5,4,2]} color="#00eaff" intensity={28} distance={28} />
    <pointLight position={[5,1,-4]} color="#ff24c8" intensity={32} distance={28} />
    <mesh position={[0,-3.48,-76]}><boxGeometry args={[10.8,.12,190]} /><meshStandardMaterial color="#030611" metalness={.9} roughness={.26} /></mesh>
    <gridHelper args={[190,95,'#00eaff','#17264d']} position={[0,-3.4,-76]} rotation={[0,0,0]} />
    <mesh position={[-2.25,-3.31,-76]}><boxGeometry args={[.045,.03,190]} /><meshBasicMaterial color="#00eaff" /></mesh>
    <mesh position={[2.25,-3.31,-76]}><boxGeometry args={[.045,.03,190]} /><meshBasicMaterial color="#ff24c8" /></mesh>
    {stations.map((station,index)=><JourneyZone key={station.id} index={index} z={-index*zoneGap} />)}
    <group ref={orbit}><DroneSwarm reduced={reduced} /></group>
    <CityRain reduced={reduced} />
  </group>;
}

function Facility({ active, reduced, travel }) {
  return <JourneyWorld active={active} reduced={reduced} travel={travel} />;
}

function World({ active, reduced, travel }) {
  return <div className="world cyber-desk" aria-hidden="true"><Canvas camera={{ position: [0, .85, 8.8], fov: 50 }} dpr={[1, 1.4]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <Suspense fallback={null}><Facility active={active} reduced={reduced} travel={travel} /></Suspense>
  </Canvas></div>;
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
  const [track, setTrack] = useState(() => localStorage.getItem('mer23lin-track') || '1');
  const selected = tracks.find((item) => item.id === track) || tracks[0];
  const loadTrack = async (src) => {
    const cache = 'caches' in window ? await caches.open(cacheName) : null;
    const cached = cache ? await cache.match(src) : null;
    if (cached) return URL.createObjectURL(await cached.blob());
    const response = await fetch(src, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Audio unavailable: ${response.status}`);
    if (cache) await cache.put(src, response.clone());
    return URL.createObjectURL(await response.blob());
  };
  const stopAudio = () => { audio.current?.pause(); setEnabled(false); };
  const startAudio = async (nextTrack = selected) => {
    if (!audio.current) audio.current = new Audio();
    const player = audio.current;
    if (!player.src || player.dataset.track !== nextTrack.id) {
      player.pause();
      if (player.src?.startsWith('blob:')) URL.revokeObjectURL(player.src);
      player.src = await loadTrack(nextTrack.src);
      player.dataset.track = nextTrack.id;
      player.loop = true;
      player.volume = .18;
    }
    await player.play();
    setEnabled(true);
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
    addEventListener('mer23lin:enter', enterWithSound);
    return () => {
      removeEventListener('mer23lin:enter', enterWithSound);
      audio.current?.pause();
      if (audio.current?.src?.startsWith('blob:')) URL.revokeObjectURL(audio.current.src);
    };
  }, []);
  const toggle = () => { if (enabled) stopAudio(); else startAudio().catch(() => setEnabled(false)); };
  return <div className="audio-controls"><button className="audio-skip" type="button" onClick={() => changeTrack(-1)} aria-label="Previous background track"><ArrowLeft /></button><button className={`audio-toggle ${enabled ? 'is-on' : ''}`} type="button" onClick={toggle} aria-pressed={enabled} aria-label={enabled ? 'Turn background music off' : 'Turn background music on'}>{enabled ? <Volume2 /> : <VolumeX />}<span>{selected.label}{enabled ? '' : ' · OFF'}</span></button><button className="audio-skip" type="button" onClick={() => changeTrack(1)} aria-label="Next background track"><ArrowRight /></button></div>;
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
      <a href="#entry" className="mark">MER<span>23</span>LIN<small>AUTONOMOUS PORTFOLIO</small></a>
      <div className="telemetry"><i /> FACILITY ONLINE <span>{station.signal} // KM-{String(Math.round(cityProgress * 4200)).padStart(4, '0')}</span></div>
      <CyberAudioToggle />
      <button className="hud-menu-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'}>{menu ? <X /> : <Menu />}</button>
    </header>
    <nav className={`rail ${menu ? 'is-open' : ''}`} aria-label="Portfolio sections">
      {stations.map((item, i) => <a key={item.id} href={`#${item.id}`} className={active === i ? 'active' : ''} onClick={(event) => travelTo(event, i)}><b>{item.label}</b><span>{item.code}</span></a>)}
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
  const [booted, setBooted] = useState(false), [menu, setMenu] = useState(false), [terminal, setTerminal] = useState(false), [query, setQuery] = useState(''), [active, setActive] = useState(0), [direction, setDirection] = useState(1), [cityProgress, setCityProgress] = useState(0);
  const activeRef = useRef(0), travelRef = useRef(0), touchStart = useRef(null), snapTimer = useRef(null), routeTarget = useRef(null), scrollAnimation = useRef(null), wheelIntent = useRef(0), wheelResetTimer = useRef(null); const reduced = useReducedMotion();
  const filtered = projects.filter(p => `${p.title} ${p.type} ${p.language} ${p.description}`.toLowerCase().includes(query.toLowerCase()));
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
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const nextProgress = maxScroll > 0 ? THREE.MathUtils.clamp(scrollY / maxScroll, 0, 1) : 0;
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
  }, [reduced]);
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
    const onTouchStart = (event) => { touchStart.current = event.touches[0]?.clientX ?? null; };
    const onTouchEnd = (event) => {
      if (touchStart.current == null) return;
      const delta = touchStart.current - (event.changedTouches[0]?.clientX ?? touchStart.current);
      if (Math.abs(delta) > 42) navigate(activeRef.current + (delta > 0 ? 1 : -1));
      touchStart.current = null;
    };
    addEventListener('keydown', onKey); addEventListener('wheel', onWheel, { passive: false });
    addEventListener('touchstart', onTouchStart, { passive: true }); addEventListener('touchend', onTouchEnd, { passive: true });
    return () => { clearTimeout(wheelResetTimer.current); removeEventListener('keydown', onKey); removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTouchStart); removeEventListener('touchend', onTouchEnd); };
  }, [terminal]);
  return <><div className="experience-shell">
    <AnimatePresence>{!booted && <BootSequence done={() => setBooted(true)} />}</AnimatePresence>
    <World active={active} reduced={reduced} travel={travelRef} /><div className="noise" /><div className="scanlines" /><CursorSignal />
    <Hud active={active} menu={menu} setMenu={setMenu} navigate={navigate} cityProgress={cityProgress} />
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
        <div className="operator"><div className="operator__photo"><img src="/profile.png" alt="Amirreza Ghaffarian" loading="eager" decoding="async" /><i /></div><div className="operator__copy"><h3>AI AGENT ENGINEER<br /><span>FULL-STACK DEVELOPER</span></h3><p>Engineering autonomous intelligence, production web platforms and visually ambitious digital experiences.</p><dl><div><dt>LOCATION</dt><dd>MASHHAD · IRAN</dd></div><div><dt>ACADEMIC CORE</dt><dd>M.Sc. AI &amp; ROBOTICS · 2026</dd></div><div><dt>STATUS</dt><dd>● OPERATIONAL</dd></div></dl><a href="https://jobinja.ir/user/NL-1212752" target="_blank" rel="noreferrer"><Briefcase /> SOURCE RESUME</a></div></div>
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
  </div><div className="city-scroll-track" aria-hidden="true">{stations.map((station) => <i className="city-snap-point" key={station.id} />)}</div></>;
}
