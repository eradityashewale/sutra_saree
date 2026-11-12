import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import SilkCloth from './SilkCloth.jsx'
import Particles from './Particles.jsx'

// The hero / collections WebGL scene. Loaded lazily (see Stage.jsx) so three.js
// never blocks the first paint. Rendering pauses when the scene is off screen.
export default function SilkScene({ tier, onReady }) {
  const wrap = useRef()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(wrap.current)
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div
      ref={wrap}
      className="absolute inset-0"
      role="img"
      aria-label="A silk saree with a gold zari border rippling in the wind. It changes colour as you scroll through the Banarasi, Kanjivaram, Silk, Cotton and Georgette collections."
    >
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, tier === 'high' ? 2 : 1.5]}
        camera={{ fov: 35, position: [0, 0, 6.5], near: 0.1, far: 50 }}
        gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => onReady?.()}
      >
        <SilkCloth tier={tier} />
        <Particles tier={tier} />
      </Canvas>
    </div>
  )
}
