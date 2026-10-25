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
vec3 col=mix(ocean,terrain,smoothstep(.5,.55,land));col=mix(col,vec3(.55,.68,.7),cloud*.75);
float light=max(dot(normalize(vNormal),normalize(vec3(-.8,.65,1.))),0.);col*=.09+light*1.5;
float rim=pow(1.-max(vNormal.z,0.),3.);col+=vec3(.09,.4,.58)*rim*light;
gl_FragColor=vec4(col,1.);}`;
const atmosphereFragment = `varying vec3 vNormal;varying vec3 vPosition;
void main(){float rim=pow(1.-abs(normalize(vNormal).z),3.5);gl_FragColor=vec4(.16,.6,.9,rim*.65);}`;

function Planet({ reduced, mobile }) {
  const ref = useRef();
  useFrame((_, delta) => { if (!reduced && ref.current) ref.current.rotation.y += delta * .012; });
  return <group position={[8, -5, -25]} rotation={[.15, 0, -.3]}>
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
    const scale = 9 / Math.max(size.x, size.y, size.z);
    clone.scale.multiplyScalar(scale);
    clone.position.copy(center).multiplyScalar(-scale);
    return clone;
  }, [scene]);
  useFrame((state, delta) => {
    const side = active % 2 ? -1 : 1;
    rig.current.position.x = THREE.MathUtils.damp(rig.current.position.x, side * 4.4, 1.8, delta);
    rig.current.position.y = reduced ? .1 : .1 + Math.sin(state.clock.elapsedTime * .22) * .16;
    rig.current.rotation.y = reduced ? -.5 : -.5 + Math.sin(state.clock.elapsedTime * .08) * .3;
  });
  return <group ref={rig} position={[4.4, .1, -5]} rotation={[.34, -.5, -.35]}>
    <primitive object={model} />
    <pointLight position={[0, 1, 3]} color="#70d9ff" intensity={24} distance={10} />
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
    effect.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), .32, .65, .86));
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
  useFrame((state, delta) => {
    const progress = reduced ? active / 6 : travel.current;
    destination.set((reduced ? 0 : state.pointer.x * .28) + Math.sin(progress * Math.PI * 2) * .65, .4 + (reduced ? 0 : state.pointer.y * .15), 13 - progress * 2.2);
    state.camera.position.lerp(destination, reduced ? 1 : 1 - Math.exp(-delta * 2));
    state.camera.lookAt(0, 0, -10);
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
      <Suspense fallback={null}><Station active={active} reduced={reduced} /></Suspense>
      <Relay position={[-7, 3, -12]} scale={.6} reduced={reduced} />
      {!mobile && <Relay position={[11, 4, -21]} scale={.45} reduced={reduced} />}
      <CameraRig travel={travel} reduced={reduced} active={active} />
      {!mobile && <CinematicBloom />}
    </Canvas>
  </SceneBoundary></div>;
}
