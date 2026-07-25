import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
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

function Particles({ count = 3000 }) {
  const mesh = useRef(null)

  const particleCount = typeof navigator !== 'undefined' && navigator.hardwareConcurrency > 4 ? count : 1000

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [particleCount])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#7c3aed"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function ParticleGrid() {
  if (!isWebGLAvailable()) return null

  return (
    <ThreeErrorBoundary fallback={null}>
      <div className="absolute inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <Particles />
        </Canvas>
      </div>
    </ThreeErrorBoundary>
  )
}
