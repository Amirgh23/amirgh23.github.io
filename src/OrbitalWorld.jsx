import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const vertex = `varying vec3 vNormal; varying vec3 vPosition;
void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const planetFragment = `varying vec3 vNormal; varying vec3 vPosition;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){return noise(p)*.55+noise(p*2.1)*.25+noise(p*4.3)*.13+noise(p*8.7)*.07;}
void main(){vec3 p=normalize(vPosition);float land=fbm(p*5.);float cloud=smoothstep(.48,.72,fbm(p*11.+vec3(5.)));
vec3 ocean=vec3(.016,.065,.11);vec3 terrain=mix(vec3(.06,.14,.16),vec3(.22,.29,.27),land);
vec3 col=mix(ocean,terrain,smoothstep(.5,.55,land));col=mix(col,vec3(.25,.36,.42),cloud*.6);
float light=max(dot(normalize(vNormal),normalize(vec3(-.8,.65,1.))),0.);col*=.035+light*.7;
float rim=pow(1.-max(vNormal.z,0.),3.);col+=vec3(.09,.4,.58)*rim*light;
gl_FragColor=vec4(col,1.);}`;
const atmosphereFragment = `varying vec3 vNormal;varying vec3 vPosition;
void main(){float rim=pow(1.-abs(normalize(vNormal).z),3.5);gl_FragColor=vec4(.16,.6,.9,rim*.65);}`;

const coreFragment = `uniform float time; varying vec3 vPosition; varying vec3 vNormal;
void main(){vec2 p=vPosition.xy;float r=length(p);float a=atan(p.y,p.x);
float spiral=sin(a*7.+r*16.-time*1.4)*.5+.5;
float filaments=pow(spiral,18.)*(1.-smoothstep(.15,2.5,r));
float rim=pow(max(0.,1.-abs(normalize(vNormal).z)),2.);
vec3 color=mix(vec3(.01,.025,.055),vec3(.02,.65,.95),filaments*.8+rim*.7);
color+=vec3(.7,.9,1.)*pow(max(0.,1.-r/1.5),8.);
gl_FragColor=vec4(color,1.);}`;

function IntelligenceGate({ reduced, mobile, active }) {
  const rig = useRef();
  const inner = useRef();
  const core = useRef();
  const clock = useRef(0);
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);
  const segments = mobile ? 24 : 48;
  const blocks = useMemo(() => Array.from({ length: segments }, (_, i) => {
    const angle = i / segments * Math.PI * 2;
    return { angle, x: Math.cos(angle) * 3.75, y: Math.sin(angle) * 3.75 };
  }), [segments]);
  useFrame((state, delta) => {
    if (!reduced) clock.current += Math.min(delta, .05);
    core.current.uniforms.time.value = clock.current;
    inner.current.rotation.z = clock.current * -.065;
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, -.42 + active * .16 + (reduced ? 0 : state.pointer.x * .12), 2, delta);
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, .14 + (reduced ? 0 : state.pointer.y * .08), 2, delta);
    rig.current.position.x = THREE.MathUtils.damp(rig.current.position.x, mobile ? 2.4 : active % 2 ? -5.4 : 5.4, 1.8, delta);
  });
  return <group ref={rig} position={[mobile ? 2.4 : 5.4, .4, -2]} rotation={[.14, -.42, -.15]} scale={mobile ? .7 : 1}>
    <mesh><torusGeometry args={[3.75, .27, 12, 96]} /><meshStandardMaterial color="#293946" metalness={.85} roughness={.29} /></mesh>
    <mesh position={[0, 0, -.28]}><torusGeometry args={[4.18, .075, 8, 96]} /><meshStandardMaterial color="#aa7150" metalness={.75} roughness={.3} /></mesh>
    {[3.34, 3.52, 4.38].map((r, i) => <mesh key={r} position={[0, 0, i * .08]}><torusGeometry args={[r, i === 0 ? .032 : .012, 6, 128]} /><meshBasicMaterial color={i === 2 ? '#f8a85d' : '#56e6ff'} toneMapped={false} /></mesh>)}
    {blocks.map(({ angle, x, y }, i) => <group key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
      <mesh><boxGeometry args={[.66, mobile ? .64 : .32, .64]} /><meshStandardMaterial color={i % 4 === 0 ? '#657581' : '#1b2936'} metalness={.8} roughness={.32} /></mesh>
      <mesh position={[.02, 0, .335]}><boxGeometry args={[.28, .045, .02]} /><meshBasicMaterial color={i % 4 === 0 ? '#ffb46e' : '#72ecff'} toneMapped={false} /></mesh>
      {i % 4 === 0 && <mesh position={[.48, 0, -.14]}><boxGeometry args={[.52, .12, .4]} /><meshStandardMaterial color="#66727b" metalness={.9} roughness={.3} /></mesh>}
    </group>)}
    <group ref={inner}>
      <mesh rotation={[.24, .1, 0]}><torusGeometry args={[2.72, .055, 8, 96, Math.PI * 1.6]} /><meshBasicMaterial color="#5bddff" toneMapped={false} /></mesh>
      <mesh rotation={[-.4, -.28, 1.4]}><torusGeometry args={[2.48, .09, 8, 96, Math.PI * 1.35]} /><meshStandardMaterial color="#b7875c" metalness={.8} roughness={.2} /></mesh>
      {[0, 1, 2].map(i => <mesh key={i} rotation={[i * .8, i * .6, i]}><torusGeometry args={[1.78, .018, 6, 80]} /><meshBasicMaterial color="#91e8ff" toneMapped={false} /></mesh>)}
    </group>
    <mesh><sphereGeometry args={[1.48, mobile ? 32 : 64, 40]} /><shaderMaterial ref={core} vertexShader={vertex} fragmentShader={coreFragment} uniforms={uniforms} /></mesh>
    <pointLight color="#29bfff" intensity={65} distance={12} position={[0, 0, 2]} />
    <pointLight color="#ff8648" intensity={35} distance={9} position={[4, 2, 1]} />
  </group>;
}

function DebrisField({ mobile, reduced }) {
  const mesh = useRef();
  const rig = useRef();
  const count = mobile ? 32 : 100;
  useEffect(() => {
    const dummy = new THREE.Object3D();
    let seed = 231;
    const rand = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const radius = 10 + rand() * 22;
      dummy.position.set(Math.cos(a) * radius, Math.sin(a) * radius * .65, -5 - rand() * 35);
      dummy.rotation.set(rand() * 6, rand() * 6, rand() * 6);
      dummy.scale.setScalar(.06 + Math.pow(rand(), 3) * .7);
      dummy.updateMatrix(); mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count]);
  useFrame((_, delta) => { if (!reduced) rig.current.rotation.z += delta * .006; });
  return <group ref={rig}><instancedMesh ref={mesh} args={[null, null, count]} frustumCulled={false}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#394654" metalness={.75} roughness={.4} /></instancedMesh></group>;
}

function Planet({ reduced, mobile }) {
  const ref = useRef();
  useFrame((_, delta) => { if (!reduced && ref.current) ref.current.rotation.y += delta * .012; });
  return <group position={[3, -18, -40]} rotation={[.15, 0, -.3]} scale={1.6}>
    <mesh ref={ref}><sphereGeometry args={[10, mobile ? 40 : 72, mobile ? 32 : 56]} /><shaderMaterial vertexShader={vertex} fragmentShader={planetFragment} /></mesh>
    <mesh scale={1.025}><sphereGeometry args={[10, 48, 32]} /><shaderMaterial vertexShader={vertex} fragmentShader={atmosphereFragment} transparent blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
  </group>;
}

function Starfield({ mobile, reduced }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const count = mobile ? 700 : 2200;
    const points = new Float32Array(count * 3);
    let seed = 23;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < count; i++) {
      points[i * 3] = (random() - .5) * 220;
      points[i * 3 + 1] = (random() - .5) * 150;
      points[i * 3 + 2] = -25 - random() * 110;
    }
    return points;
  }, [mobile]);
  useFrame((_, delta) => { if (!reduced && ref.current) ref.current.rotation.z += delta * .0015; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#c8e2f4" size={.085} sizeAttenuation transparent opacity={.85} depthWrite={false} /></points>;
}

function Station({ active, reduced }) {
  const { scene } = useGLTF('/models/orbital-station.glb');
  const rig = useRef();
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 3.3 / Math.max(size.x, size.y, size.z);
    clone.scale.multiplyScalar(scale);
    clone.position.copy(center).multiplyScalar(-scale);
    return clone;
  }, [scene]);
  useFrame((state, delta) => {
    const side = active % 2 ? -1 : 1;
    rig.current.position.x = THREE.MathUtils.damp(rig.current.position.x, side * 10, 1.8, delta);
    rig.current.position.y = reduced ? -3.4 : -3.4 + Math.sin(state.clock.elapsedTime * .22) * .16;
    rig.current.rotation.y = reduced ? -.5 : -.5 + Math.sin(state.clock.elapsedTime * .08) * .3;
  });
  return <group ref={rig} position={[10, -3.4, -8]} rotation={[.34, -.5, -.35]}>
    <primitive object={model} />
    <pointLight position={[0, 1, 3]} color="#70d9ff" intensity={24} distance={10} />
  </group>;
}

function OrbitalPaths({ reduced, mobile }) {
  const rig = useRef();
  useFrame((_, delta) => { if (!reduced && rig.current) rig.current.rotation.z += delta * .015; });
  return <group ref={rig} position={[8, -5, -25]} rotation={[1.1, .25, -.35]}>
    {[12.4, 14.1, 16.2].slice(0, mobile ? 1 : 3).map((radius, index) => <group key={radius} rotation={[index * .18, index * .12, 0]}>
      <mesh><torusGeometry args={[radius, .012, 4, mobile ? 100 : 180]} /><meshBasicMaterial color="#74cbe8" transparent opacity={.18 - index * .035} depthWrite={false} /></mesh>
      <mesh position={[radius, 0, 0]}><sphereGeometry args={[.09, 8, 8]} /><meshBasicMaterial color="#f1b77a" toneMapped={false} /></mesh>
    </group>)}
  </group>;
}

function Relay({ position, scale = 1, reduced }) {
  const ref = useRef();
  useFrame((_, delta) => { if (!reduced) ref.current.rotation.y += delta * .06; });
  return <group ref={ref} position={position} scale={scale} rotation={[.4, .3, .3]}>
    <mesh><cylinderGeometry args={[.2, .3, 1.2, 12]} /><meshStandardMaterial color="#c2cad0" metalness={.8} roughness={.35} /></mesh>
    {[-1, 1].map(side => <group key={side} position={[side * 1.1, 0, 0]}>
      <mesh><boxGeometry args={[1.7, .025, 1.2]} /><meshStandardMaterial color="#183f60" metalness={.65} roughness={.28} /></mesh>
      {[0, 1, 2, 3].map(i => <mesh key={i} position={[-.65 + i * .44, .02, 0]}><boxGeometry args={[.012, .012, 1.2]} /><meshBasicMaterial color="#678b9c" /></mesh>)}
    </group>)}
    <mesh position={[0, .85, 0]}><sphereGeometry args={[.045, 8, 6]} /><meshBasicMaterial color="#ffad59" toneMapped={false} /></mesh>
  </group>;
}

function CinematicBloom() {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const effect = new EffectComposer(gl);
    effect.addPass(new RenderPass(scene, camera));
    effect.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), .65, .55, .72));
    effect.addPass(new OutputPass());
    return effect;
  }, [gl, scene, camera]);
  useEffect(() => { composer.setSize(size.width, size.height); }, [composer, size]);
  useEffect(() => () => { composer.passes.forEach(pass => pass.dispose?.()); composer.dispose(); }, [composer]);
  useFrame((_, delta) => composer.render(delta), 1);
  return null;
}

function CameraRig({ travel, reduced, active }) {
  const destination = useMemo(() => new THREE.Vector3(), []);
  const nextShot = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(0, 0, -5), []);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = event => { pointer.current.x = event.clientX / innerWidth * 2 - 1; pointer.current.y = 1 - event.clientY / innerHeight * 2; };
    const leave = () => { pointer.current.x = 0; pointer.current.y = 0; };
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => { removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, []);
  const shots = [[0, .7, 13], [-1.8, 1.5, 11], [1.4, -.4, 12], [-1, 2, 10], [1.8, .5, 14], [-2, -.5, 11], [0, 1, 12]];
  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp((reduced ? active / 6 : travel.current) * 6, 0, 6);
    const from = Math.floor(progress), to = Math.min(6, from + 1), mix = progress - from;
    destination.fromArray(shots[from]).lerp(nextShot.fromArray(shots[to]), mix);
    if (!reduced) { destination.x += pointer.current.x * .65; destination.y += pointer.current.y * .35; }
    state.camera.position.lerp(destination, reduced ? 1 : 1 - Math.exp(-delta * 2));
    state.camera.lookAt(target);
  });
  return null;
}

class SceneBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function OrbitalWorld({ active, reduced, travel, mobile }) {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);
  return <div className="world orbital-world" aria-hidden="true"><SceneBoundary>
    <Canvas camera={{ position: [0, .4, 13], fov: mobile ? 55 : 43, near: .1, far: 250 }} dpr={mobile ? 1 : [1, 1.35]} frameloop={visible ? 'always' : 'never'} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}>
      <ambientLight intensity={.65} color="#758fae" />
      <directionalLight position={[-9, 7, 5]} color="#fff1da" intensity={4} />
      <directionalLight position={[9, -2, -5]} color="#458dde" intensity={2.5} />
      <Starfield mobile={mobile} reduced={reduced} />
      <Planet reduced={reduced} mobile={mobile} />
      <IntelligenceGate active={active} reduced={reduced} mobile={mobile} />
      <DebrisField mobile={mobile} reduced={reduced} />
      <SceneBoundary><Suspense fallback={null}><Station active={active} reduced={reduced} /></Suspense></SceneBoundary>
      <Relay position={[-7, 3, -12]} scale={.6} reduced={reduced} />
      {!mobile && <Relay position={[11, 4, -21]} scale={.45} reduced={reduced} />}
      <CameraRig travel={travel} reduced={reduced} active={active} />
      {!mobile && <CinematicBloom />}
    </Canvas>
  </SceneBoundary></div>;
}
