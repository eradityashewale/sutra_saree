import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { clothVertex, silkFragment } from './silkShader.js'
import { collections, heroLook } from '../data/collections.js'
import { stage } from '../lib/stage.js'

const W = 10
const H = 6.4

// Pre-convert every look's colours once.
const toLook = (l) => ({
  ...l,
  a: new THREE.Color(l.colors.a),
  b: new THREE.Color(l.colors.b),
  gold: new THREE.Color(l.colors.gold),
})
const HERO = toLook(heroLook)
const LOOKS = collections.map(toLook)

export default function SilkCloth({ tier }) {
  const group = useRef()
  const viewport = useThree((s) => s.viewport)
  const seg = tier === 'high' ? [220, 140] : [110, 70]

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: HERO.amp },
      uSheen: { value: HERO.sheen },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: HERO.a.clone() },
      uColorB: { value: HERO.b.clone() },
      uGold: { value: HERO.gold.clone() },
      uRepeat: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  )

  useFrame((state, dt) => {
    const look = stage.index < 0 ? HERO : LOOKS[stage.index]
    const k = 1 - Math.exp(-dt * 2.2) // frame-rate independent easing
    const u = uniforms
    u.uTime.value += Math.min(dt, 0.05)
    u.uColorA.value.lerp(look.a, k)
    u.uColorB.value.lerp(look.b, k)
    u.uGold.value.lerp(look.gold, k)
    u.uAmp.value += (look.amp - u.uAmp.value) * k
    u.uSheen.value += (look.sheen - u.uSheen.value) * k
    // The bulge follows the pointer / device tilt.
    u.uPointer.value.x += (stage.pointer.x * W * 0.45 - u.uPointer.value.x) * k * 1.5
    u.uPointer.value.y += (stage.pointer.y * H * 0.45 - u.uPointer.value.y) * k * 1.5

    const g = group.current
    const portrait = viewport.width < viewport.height
    // On phones the cloth sits higher and more central, above the headline.
    const px = portrait ? look.pos[0] * 0.15 : look.pos[0]
    const py = portrait ? look.pos[1] + viewport.height * 0.12 : look.pos[1]
    g.position.x += (px - g.position.x) * k
    g.position.y += (py - g.position.y) * k
    g.position.z += (look.pos[2] - g.position.z) * k
    g.rotation.x += (look.rot[0] - stage.pointer.y * 0.08 - g.rotation.x) * k
    g.rotation.y += (look.rot[1] + stage.pointer.x * 0.12 - g.rotation.y) * k
    g.rotation.z += (look.rot[2] - g.rotation.z) * k
  })

  const s = Math.max(viewport.width / W, viewport.height / H) * (viewport.width < viewport.height ? 0.78 : 0.9)

  return (
    <group ref={group} scale={s} rotation={HERO.rot} position={HERO.pos}>
      <mesh>
        <planeGeometry args={[W, H, seg[0], seg[1]]} />
        <shaderMaterial
          vertexShader={clothVertex}
          fragmentShader={silkFragment}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
