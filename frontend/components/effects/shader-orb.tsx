"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

function Orb() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColorA: { value: new THREE.Color("#58d8ff") }, uColorB: { value: new THREE.Color("#1455ff") } },
    vertexShader: `varying vec2 vUv; varying vec3 vNormal; uniform float uTime; void main(){ vUv=uv; vNormal=normal; vec3 p=position + normal * sin(position.y*5.0+uTime)*0.045; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`,
    fragmentShader: `varying vec2 vUv; varying vec3 vNormal; uniform float uTime; uniform vec3 uColorA; uniform vec3 uColorB; void main(){ float fresnel=pow(1.0-dot(normalize(vNormal), vec3(0.,0.,1.)),2.0); float wave=sin((vUv.x+vUv.y)*10.0+uTime)*0.08; vec3 color=mix(uColorB,uColorA,vUv.y+wave); gl_FragColor=vec4(color, .28 + fresnel*.55); }`,
    transparent: true, blending: THREE.AdditiveBlending
  }), []);
  useFrame((_, delta) => { if (mesh.current) { mesh.current.rotation.y += delta * .18; mesh.current.rotation.x += delta * .07; } material.uniforms.uTime.value += delta; });
  return <mesh ref={mesh} material={material}><icosahedronGeometry args={[2.25, 48]} /></mesh>;
}

export function ShaderOrb({ className = "" }: { className?: string }) {
  return <div className={className}><Canvas camera={{ position: [0, 0, 5.2], fov: 42 }} gl={{ alpha: true, antialias: true }}><ambientLight intensity={1.1} /><Orb /></Canvas></div>;
}
