import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { CAMERA_POINTS, CAMERA_LENSES } from './cameraRoute';

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
` + planetFragment.slice(planetFragment.indexOf('float hash'), planetFragment.indexOf('void main')) + `
void main(){vec3 p=normalize(vPosition);float t=time*.065;
float density=fbm(p*4.+vec3(t,-t*.7,t*.3));
float veins=pow(1.-abs(sin(density*15.+p.y*3.-time*.16)),7.);
float rim=pow(1.-abs(normalize(vNormal).z),2.5);
vec3 color=vec3(.004,.018,.03)+vec3(.018,.13,.22)*density;
color+=vec3(.16,.72,.95)*veins*.5+vec3(.07,.35,.55)*rim;
color+=vec3(.4,.7,.9)*pow(max(0.,dot(p,normalize(vec3(-.5,.4,1.)))),24.)*.4;
gl_FragColor=vec4(color,1.);}`;

function IntelligenceGate({ reduced, mobile }) {
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
  useFrame((_, delta) => {
    if (!reduced) clock.current += Math.min(delta, .05);
    core.current.uniforms.time.value = clock.current;
    inner.current.rotation.z = clock.current * -.065;
  });
  return <group ref={rig} position={[0, 2, 0]} rotation={[.06, -.15, -.08]} scale={1.5}>
    <mesh><torusGeometry args={[3.75, .27, 12, 96]} /><meshStandardMaterial color="#293946" metalness={.85} roughness={.29} /></mesh>
    <mesh position={[0, 0, -.28]}><torusGeometry args={[4.18, .075, 8, 96]} /><meshStandardMaterial color="#aa7150" metalness={.75} roughness={.3} /></mesh>
    {[3.34, 3.52, 4.38].map((r, i) => <mesh key={r} position={[0, 0, i * .08]}><torusGeometry args={[r, i === 0 ? .032 : .012, 6, 128]} /><meshBasicMaterial color={i === 2 ? '#f8a85d' : '#56e6ff'} toneMapped={false} /></mesh>)}
    {blocks.map(({ angle, x, y }, i) => <group key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
      <mesh><boxGeometry args={[.66, mobile ? .64 : .32, .64]} /><meshStandardMaterial color={i % 4 === 0 ? '#657581' : '#1b2936'} metalness={.8} roughness={.32} /></mesh>
      <mesh position={[.02, 0, .335]}><boxGeometry args={[.28, .045, .02]} /><meshBasicMaterial color={i % 4 === 0 ? '#ffb46e' : '#72ecff'} toneMapped={false} /></mesh>
      <mesh position={[.02, 0, -.335]}><boxGeometry args={[.28, .045, .02]} /><meshBasicMaterial color={i % 4 === 0 ? '#ffb46e' : '#72ecff'} toneMapped={false} /></mesh>
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

function Starfield({ mobile, reduced }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const count = mobile ? 700 : 2200;
    const points = new Float32Array(count * 3);
    let seed = 23;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2, height = random() * 2 - 1, radius = 100 + random() * 60;
      points[i * 3] = Math.cos(angle) * Math.sqrt(1 - height * height) * radius;
      points[i * 3 + 1] = height * radius;
      points[i * 3 + 2] = Math.sin(angle) * Math.sqrt(1 - height * height) * radius;
    }
    return points;
  }, [mobile]);
  useFrame((_, delta) => { if (!reduced && ref.current) ref.current.rotation.z += delta * .0015; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#c8e2f4" size={.085} sizeAttenuation transparent opacity={.85} depthWrite={false} /></points>;
}

function Station() {
  const { scene } = useGLTF('/models/orbital-station.glb');
  const rig = useRef();
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 18 / Math.max(size.x, size.y, size.z);
    clone.scale.multiplyScalar(scale);
    clone.position.copy(center).multiplyScalar(-scale);
    return clone;
  }, [scene]);
  return <group ref={rig} position={[-30, 10, -32]} rotation={[.34, -.5, -.35]}>
    <primitive object={model} />
    <pointLight position={[0, 1, 3]} color="#70d9ff" intensity={24} distance={10} />
  </group>;
}

// A single anchored installation: every camera angle sees the same architecture.
function Observatory({ mobile }) {
  const towers = useMemo(() => Array.from({ length: mobile ? 12 : 24 }, (_, i) => {
    const angle = i / (mobile ? 12 : 24) * Math.PI * 2;
    const radius = 29 + (i % 3) * 3;
    return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, height: 5 + (i * 7 % 11), angle };
  }), [mobile]);
  return <group>
    <mesh position={[0, -5.5, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[85, 96]} /><meshStandardMaterial color="#040b12" metalness={.08} roughness={.92} /></mesh>
    <gridHelper args={[150, mobile ? 40 : 80, '#153d4b', '#0a1d29']} position={[0, -5.48, 0]} />
    <mesh position={[0, -5.15, 0]}><cylinderGeometry args={[9.5, 10.3, .65, 64]} /><meshStandardMaterial color="#101e28" metalness={.55} roughness={.58} /></mesh>
    {[9.4, 8.8, 7.4].map((r, i) => <mesh key={r} position={[0, -4.8 + i * .01, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, .025, 6, 128]} /><meshBasicMaterial color={i === 0 ? '#e49a5b' : '#3bb3d1'} toneMapped={false} /></mesh>)}
    {[-1, 1].map(side => <group key={side} position={[side * 5, -2.5, 0]} rotation={[0, 0, side * -.22]}>
      <mesh><boxGeometry args={[.85, 5, 1.7]} /><meshStandardMaterial color="#21333e" metalness={.8} roughness={.33} /></mesh>
      <mesh position={[0, 0, .87]}><boxGeometry args={[.09, 3.9, .025]} /><meshBasicMaterial color="#7cecff" toneMapped={false} /></mesh>
      <mesh position={[0, 0, -.87]}><boxGeometry args={[.09, 3.9, .025]} /><meshBasicMaterial color="#7cecff" toneMapped={false} /></mesh>
    </group>)}
    {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return <group key={i} position={[Math.cos(a) * 8.4, -4.68, Math.sin(a) * 8.4]} rotation={[0, -a, 0]}>
      <mesh><boxGeometry args={[.55, .18, 1.1]} /><meshStandardMaterial color="#445362" metalness={.8} roughness={.3} /></mesh>
      <mesh position={[0, .1, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.32, .7]} /><meshBasicMaterial color="#79dcff" toneMapped={false} /></mesh>
    </group>; })}
    {towers.map((tower, i) => <group key={i} position={[tower.x, -5.5, tower.z]} rotation={[0, -tower.angle, 0]}>
      <mesh position={[0, tower.height / 2, 0]}><boxGeometry args={[1.4, tower.height, 2.1]} /><meshStandardMaterial color="#122431" metalness={.75} roughness={.38} /></mesh>
      <mesh position={[.73, tower.height / 2, 0]}><boxGeometry args={[.03, tower.height * .72, .07]} /><meshBasicMaterial color={i % 3 ? '#317c9b' : '#d98c57'} toneMapped={false} /></mesh>
      <mesh position={[0, tower.height + .1, 0]}><sphereGeometry args={[.08, 6, 6]} /><meshBasicMaterial color="#ff9b62" toneMapped={false} /></mesh>
    </group>)}
    <spotLight position={[8, 18, 8]} angle={.48} penumbra={1} intensity={180} color="#87dfff" distance={65} />
    <spotLight position={[-10, 8, -5]} angle={.6} penumbra={1} intensity={120} color="#e4a373" distance={50} />
  </group>;
}

const nebulaFragment = `varying vec3 vPosition;
float hash(vec3 p){return fract(sin(dot(p,vec3(12.9,78.2,43.1)))*43758.5);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
void main(){vec3 p=normalize(vPosition);float n=noise(p*4.)*.6+noise(p*9.)*.3+noise(p*18.)*.1;
float band=exp(-pow((p.y-.18+sin(p.x*3.)*.16)*4.,2.));
vec3 color=mix(vec3(.002,.006,.012),vec3(.018,.055,.085),band*n);
color+=vec3(.045,.014,.007)*pow(n,3.)*band;gl_FragColor=vec4(color,1.);}`;

function Nebula() {
  return <mesh><sphereGeometry args={[180, 48, 32]} /><shaderMaterial side={THREE.BackSide} depthWrite={false} vertexShader={vertex} fragmentShader={nebulaFragment} /></mesh>;
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

// The subject stays fixed. Scroll scrubs a 3D dolly route around it.
function CameraRig({ travel, reduced, paused, active, mobile, cinema }) {
  const route = useMemo(() => new THREE.CatmullRomCurve3(CAMERA_POINTS.map(p => new THREE.Vector3(...p)), false, 'centripetal'), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const progress = useRef(travel.current);
  const framing = useRef(cinema ? 0 : 4.6);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = event => { pointer.current.x = event.clientX / innerWidth * 2 - 1; pointer.current.y = 1 - event.clientY / innerHeight * 2; };
    const leave = () => { pointer.current.x = 0; pointer.current.y = 0; };
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => { removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, []);
  useFrame(({ camera }, rawDelta) => {
    if (paused) return;
    const delta = Math.min(rawDelta, .05);
    const desired = THREE.MathUtils.clamp(reduced ? active / 6 : travel.current, 0, 1);
    progress.current = reduced ? desired : THREE.MathUtils.damp(progress.current, desired, 3.5, delta);
    route.getPoint(progress.current, position);
    if (mobile) position.multiplyScalar(1.22);
    right.set(position.z, 0, -position.x).normalize();
    const desiredFraming = cinema ? 0 : mobile ? .7 : 4.6;
    framing.current = reduced ? desiredFraming : THREE.MathUtils.damp(framing.current, desiredFraming, 3, delta);
    target.set(0, 1.8, 0).addScaledVector(right, -framing.current);
    if (!reduced && !mobile) {
      position.addScaledVector(right, pointer.current.x * .28);
      target.y += pointer.current.y * .18;
    }
    camera.position.copy(position);
    camera.lookAt(target);
    const index = progress.current * 6, from = Math.floor(index), to = Math.min(6, from + 1);
    const fov = THREE.MathUtils.lerp(CAMERA_LENSES[from], CAMERA_LENSES[to], index - from) + (mobile ? 12 : 0);
    if (Math.abs(camera.fov - fov) > .01) { camera.fov = fov; camera.updateProjectionMatrix(); }
  });
  return null;
}

class SceneBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function OrbitalWorld({ active, reduced, paused, travel, mobile, cinema }) {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);
  return <div className="world orbital-world" aria-hidden="true"><SceneBoundary>
    <Canvas camera={{ position: CAMERA_POINTS[0], fov: mobile ? 55 : 43, near: .1, far: 250 }} dpr={mobile ? 1 : [1, 1.35]} frameloop={visible ? 'always' : 'never'} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}>
      <color attach="background" args={['#030810']} />
      <fogExp2 attach="fog" args={['#07111d', .024]} />
      <Nebula />
      <ambientLight intensity={.4} color="#758fae" />
      <directionalLight position={[-9, 7, 5]} color="#c7dce9" intensity={1.6} />
      <directionalLight position={[9, -2, -5]} color="#458dde" intensity={1.4} />
      <Starfield mobile={mobile} reduced={reduced || paused} />
      <Observatory mobile={mobile} />
      <IntelligenceGate reduced={reduced || paused} mobile={mobile} />
      <DebrisField mobile={mobile} reduced={reduced || paused} />
      <SceneBoundary><Suspense fallback={null}><Station /></Suspense></SceneBoundary>
      <Relay position={[17, 12, -18]} scale={1.5} reduced={reduced || paused} />
      {!mobile && <Relay position={[-24, 14, 11]} scale={1.2} reduced={reduced || paused} />}
      <CameraRig travel={travel} reduced={reduced} paused={paused} active={active} mobile={mobile} cinema={cinema} />
      {!mobile && <CinematicBloom />}
    </Canvas>
  </SceneBoundary></div>;
}
