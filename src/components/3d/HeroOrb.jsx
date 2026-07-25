import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import ThreeErrorBoundary from './ThreeErrorBoundary'

function isWebGLAvailable() {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2')) ||
           !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch (e) {
    return false
  }
}

function GlowOrb() {
  const mesh = useRef(null)

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.x = state.clock.elapsedTime * 0.2
    mesh.current.rotation.y = state.clock.elapsedTime * 0.3
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={mesh}>
        {/* Inner distorted sphere */}
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#7c3aed"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </Sphere>
        {/* Outer wireframe */}
        <Sphere args={[1.5, 16, 16]}>
          <meshBasicMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.15}
          />
        </Sphere>
      </group>
    </Float>
  )
}

export default function HeroOrb() {
  if (!isWebGLAvailable()) return null

  return (
    <ThreeErrorBoundary fallback={null}>
      <div className="absolute right-0 top-0 w-[500px] h-[500px] pointer-events-none opacity-70 hidden lg:block">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color="#7c3aed" intensity={2} />
          <pointLight position={[-10, -10, -10]} color="#a855f7" intensity={1} />
          <GlowOrb />
        </Canvas>
      </div>
    </ThreeErrorBoundary>
  )
}
