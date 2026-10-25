import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const accents = ['#d7b98a', '#82bfc4', '#d7b98a', '#a9b8ce', '#82bfc4', '#d7b98a', '#d7b98a'];

function Portal({ z, index }) {
  return <group position={[0, 0, z]}>
    {[-1, 1].map(side => <group key={side} position={[side * 7, 0, 0]}>
      <mesh position={[0, 1, 0]}><boxGeometry args={[.65, 11, 1.1]} /><meshStandardMaterial color="#202a30" metalness={.65} roughness={.38} /></mesh>
      <mesh position={[-side * .34, 1, .22]}><boxGeometry args={[.025, 9, .12]} /><meshBasicMaterial color={accents[index]} /></mesh>
    </group>)}
    <mesh position={[0, 6.3, 0]}><boxGeometry args={[14.65, .45, 1.1]} /><meshStandardMaterial color="#27343a" metalness={.6} roughness={.38} /></mesh>
    <mesh position={[0, 6.05, .25]}><boxGeometry args={[12.8, .025, .15]} /><meshBasicMaterial color="#d7b98a" /></mesh>
    <mesh position={[0, -3.25, 0]}><boxGeometry args={[13.5, .018, .12]} /><meshBasicMaterial color={accents[index]} transparent opacity={.4} /></mesh>
  </group>;
}

function Sculpture({ reduced, active }) {
  const outer = useRef(), inner = useRef();
  useFrame((state, delta) => {
    if (reduced) return;
    outer.current.rotation.y += delta * .13;
    outer.current.rotation.z = Math.sin(state.clock.elapsedTime * .2) * .12;
    inner.current.rotation.x += delta * .17;
    inner.current.rotation.z -= delta * .1;
  });
  return <group position={[active % 2 ? -4.1 : 4.1, .2, -8]}>
    <mesh position={[0, -2.9, 0]}><cylinderGeometry args={[2.1, 2.3, .55, 64]} /><meshStandardMaterial color="#28343a" metalness={.8} roughness={.28} /></mesh>
    <mesh position={[0, -2.61, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.8, 1.83, 64]} /><meshBasicMaterial color={accents[active]} side={THREE.DoubleSide} /></mesh>
    <group ref={outer} rotation={[.3, .4, -.15]}>
      {[0, 1, 2].map(i => <mesh key={i} rotation={[i * Math.PI / 3, i * Math.PI / 3, 0]}>
        <torusGeometry args={[1.95 - i * .24, .065, 12, 80]} />
        <meshStandardMaterial color={i === 1 ? '#9bb8bf' : '#d7b98a'} metalness={.85} roughness={.25} />
      </mesh>)}
      <mesh ref={inner}><icosahedronGeometry args={[.94, 0]} /><meshStandardMaterial color="#a2bcc5" metalness={.9} roughness={.22} flatShading /></mesh>
      <mesh scale={1.03}><icosahedronGeometry args={[.94, 0]} /><meshBasicMaterial color={accents[active]} wireframe transparent opacity={.35} /></mesh>
    </group>
    <pointLight position={[0, 2, 2]} color={accents[active]} intensity={30} distance={12} />
  </group>;
}

export default function SpatialGallery({ active, reduced, travel }) {
  const room = useRef();
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, delta) => {
    const progress = reduced ? active / 6 : travel.current;
    target.set(reduced ? 0 : state.pointer.x * .32, .8 + (reduced ? 0 : state.pointer.y * .16), 10 - progress * 8);
    state.camera.position.lerp(target, 1 - Math.exp(-delta * 4));
    look.set(0, .45, -18);
    state.camera.lookAt(look);
    room.current.position.z = progress * 5;
  });
  return <>
    <color attach="background" args={['#0b1116']} />
    <fog attach="fog" args={['#0b1116', 22, 85]} />
    <ambientLight intensity={.75} color="#b4c8d2" />
    <hemisphereLight args={['#c7d8e1', '#3b3026', 1.4]} />
    <directionalLight position={[3, 8, 4]} intensity={3} color="#ffe5be" />
    <directionalLight position={[-7, 3, -10]} intensity={2} color="#7eaebf" />
    <group ref={room}>
      <mesh position={[0, -3.6, -30]}><boxGeometry args={[90, .4, 150]} /><meshStandardMaterial color="#182329" metalness={.65} roughness={.32} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <Portal key={i} z={-i * 11 - 4} index={i} />)}
      {[-1, 1].map(side => <group key={side}>
        <mesh position={[side * 12, 1, -32]}><boxGeometry args={[1, 15, 96]} /><meshStandardMaterial color="#162128" roughness={.8} /></mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[side * 10, 1.2, -i * 7]} rotation={[0, side * .2, 0]}>
          <boxGeometry args={[.18, 10, 2.8]} /><meshStandardMaterial color={i % 3 ? '#283b43' : '#5b6867'} metalness={.65} roughness={.4} />
        </mesh>)}
        <mesh position={[side * 6.3, -3.36, -32]}><boxGeometry args={[.035, .025, 95]} /><meshBasicMaterial color="#d7b98a" /></mesh>
      </group>)}
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0, 7.5, -i * 9]}>
        <boxGeometry args={[4, .06, 2]} /><meshBasicMaterial color="#d4e1df" transparent opacity={.5} />
      </mesh>)}
      <mesh position={[0, 1, -75]}><circleGeometry args={[5, 80]} /><meshBasicMaterial color="#7a9fa3" /></mesh>
      <mesh position={[0, 1, -74.9]}><circleGeometry args={[4.8, 80]} /><meshBasicMaterial color="#101c23" /></mesh>
    </group>
    <Sculpture reduced={reduced} active={active} />
  </>;
}

