import { Suspense, useRef } from 'react'
import { Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import Model from './Model'

function SceneReady({ onReady }) {
  const notified = useRef(false)
  useFrame(() => {
    if (!notified.current) {
      notified.current = true
      onReady()
    }
  })
  return null
}

export default function Scene({ pageId, onNavigate, onReady }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Model pageId={pageId} onNavigate={onNavigate} />
        <SceneReady onReady={onReady} />
      </Suspense>
      
    </>
  )
}