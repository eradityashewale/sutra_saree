import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const rand = (a, b) => a + Math.random() * (b - a)

// Marigold petals: one instanced draw call of a tiny bent quad.
function Petals({ count }) {
  const ref = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: rand(-5, 5),
        y: rand(-3.5, 3.5),
        z: rand(0.6, 2.6),
        speed: rand(0.12, 0.34),
        sway: rand(0.2, 0.7),
        phase: rand(0, 6.28),
        spin: rand(0.3, 1.2),
        size: rand(0.05, 0.11),
      })),
    [count],
  )
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1.5, 1, 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.abs(pos.getY(i)) * 0.35) // curl the tip
    g.computeVertexNormals()
    return g
  }, [])
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const palette = ['#F29A1F', '#E8791D', '#F6B93B', '#D9661A'].map((c) => new THREE.Color(c))
    for (let i = 0; i < count; i++) palette[i % palette.length].toArray(arr, i * 3)
    return arr
  }, [count])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const d = Math.min(dt, 0.05)
    petals.forEach((p, i) => {
      p.y -= p.speed * d
      if (p.y < -3.6) {
        p.y = 3.6
        p.x = rand(-5, 5)
      }
      dummy.position.set(p.x + Math.sin(t * p.sway + p.phase) * 0.35, p.y, p.z)
      dummy.rotation.set(t * p.spin + p.phase, t * p.spin * 0.7, p.phase)
      dummy.scale.setScalar(p.size)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[geometry, null, count]} frustumCulled={false}>
      <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  )
}

// Gold dust: a single Points cloud that drifts slowly.
function Dust({ count }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = rand(-6, 6)
      arr[i * 3 + 1] = rand(-4, 4)
      arr[i * 3 + 2] = rand(-1, 3)
    }
    return arr
  }, [count])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 0.05) * 0.2
    ref.current.position.y = Math.sin(t * 0.2) * 0.15
    ref.current.material.opacity = 0.55 + Math.sin(t * 1.3) * 0.15
  })
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#E9C46A"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Particles({ tier }) {
  const high = tier === 'high'
  return (
    <>
      <Petals count={high ? 34 : 12} />
      <Dust count={high ? 420 : 140} />
    </>
  )
}
