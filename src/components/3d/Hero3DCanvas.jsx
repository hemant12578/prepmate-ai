import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero3DCanvas({ height = '350px' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const h = container.clientHeight || 350

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / h, 0.1, 1000)
    camera.position.z = 18

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 3D Particles Outer Sphere (Neural Node Mesh)
    const particleCount = 700
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const color1 = new THREE.Color('#7c3aed') // Purple
    const color2 = new THREE.Color('#3b82f6') // Blue
    const color3 = new THREE.Color('#10b981') // Emerald

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 7 + Math.random() * 2

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const mixedColor = Math.random() > 0.6 ? color1 : Math.random() > 0.3 ? color2 : color3
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // Inner 3D Geometric Hologram Core (Icosahedron Wireframe)
    const icoGeometry = new THREE.IcosahedronGeometry(4, 1)
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    })
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial)
    scene.add(icoMesh)

    // Inner Solid Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(2, 0)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    scene.add(innerMesh)

    // Mouse Interaction
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouseX = (e.clientX - rect.left - rect.width / 2) * 0.001
      mouseY = (e.clientY - rect.top - rect.height / 2) * 0.001
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return
      const newW = container.clientWidth
      const newH = container.clientHeight || 350
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
      renderer.setSize(newW, newH)
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animationFrameId
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      targetX += (mouseX - targetX) * 0.05
      targetY += (mouseY - targetY) * 0.05

      particleSystem.rotation.y += 0.002
      particleSystem.rotation.x += 0.001

      icoMesh.rotation.y -= 0.004
      icoMesh.rotation.x += 0.003

      innerMesh.rotation.y += 0.006
      innerMesh.rotation.z -= 0.003

      scene.rotation.y = targetX * 2
      scene.rotation.x = -targetY * 2

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      icoGeometry.dispose()
      icoMaterial.dispose()
      innerGeo.dispose()
      innerMat.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-hidden rounded-3xl"
      style={{ height }}
    />
  )
}
