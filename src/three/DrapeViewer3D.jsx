import { Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { drapeVertex, silkFragment } from './silkShader.js'

// Used when a product has a GLB:  "model": "/models/my-saree.glb"  (Draco-compressed is fine).
function Model({ url }) {
  const { scene } = useGLTF(url, true)
  return (
    <Bounds fit clip observe margin={1.15}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  )
}

// Default: a procedural drape in the product's own colours, so every saree
// gets a 360° view even before you have a 3D scan.
function ProceduralDrape({ colors }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 1 },
      uSheen: { value: 1 },
      uColorA: { value: new THREE.Color(colors[0]) },
      uColorB: { value: new THREE.Color(colors[1]) },
      uGold: { value: new THREE.Color('#C9A24B') },
      uRepeat: { value: new THREE.Vector2(2, 1) },
    }),
    [colors],
  )
  useFrame((_, dt) => (uniforms.uTime.value += Math.min(dt, 0.05)))
  return (
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.42, 1.05, 2.9, 200, 80, true]} />
      <shaderMaterial
        vertexShader={drapeVertex}
        fragmentShader={silkFragment}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        defines={{ FLAT_NORMALS: '' }}
      />
    </mesh>
  )
}

export default function DrapeViewer3D({ product, autoRotate = true }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ fov: 35, position: [0, 0.3, 5.4] }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, 1, 2]} intensity={0.8} />
      <Suspense fallback={null}>
        {product.model ? <Model url={product.model} /> : <ProceduralDrape colors={product.colors} />}
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        minDistance={2.4}
        maxDistance={8}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.72}
        autoRotate={autoRotate}
        autoRotateSpeed={1.4}
      />
    </Canvas>
  )
}
