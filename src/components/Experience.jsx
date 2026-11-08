import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Scene from './Scene'
import { damp, mouseRotationTarget } from '../cameraMotion'

const clamp = (v) => Math.max(-1, Math.min(1, v))

const ROTATION_START = 0.4
const smoothstep = (t) => t * t * (3 - 2 * t)

const rotationFactor = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  return smoothstep(Math.min(1, Math.max(0, (progress - ROTATION_START) / (1 - ROTATION_START))))
}

function CameraRig({ cameraConfig }) {
  const pointer = useRef({ x: 0, y: 0 })
  const rotation = useRef({ pitch: 0, yaw: 0, mousePitch: 0, mouseYaw: 0 })

  useEffect(() => {
    const handlePointerMove = (event) => {
      pointer.current.x = clamp((event.clientX / window.innerWidth) * 2 - 1)
      pointer.current.y = clamp(1 - (event.clientY / window.innerHeight) * 2)
    }

    const resetPointer = () => {
      pointer.current.x = 0
      pointer.current.y = 0
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('blur', resetPointer)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', resetPointer)
    }
  }, [])

  useFrame(({ camera }, delta) => {
    const smoothing = 1 - Math.exp(-delta * cameraConfig.transitionSpeed)
    const [pagePitch, pageYaw, pageRoll] = cameraConfig.orientation
    const target = mouseRotationTarget(pointer.current, window.innerWidth, rotationFactor(), cameraConfig.mouseRotation)
    const current = rotation.current
    current.pitch = damp(current.pitch, pagePitch, cameraConfig.transitionSpeed, delta)
    current.yaw = damp(current.yaw, pageYaw, cameraConfig.transitionSpeed, delta)
    current.mousePitch = damp(current.mousePitch, target.pitch, cameraConfig.mouseRotation.damping, delta)
    current.mouseYaw = damp(current.mouseYaw, target.yaw, cameraConfig.mouseRotation.damping, delta)
    camera.rotation.x = current.pitch + current.mousePitch
    camera.rotation.y = current.yaw + current.mouseYaw
    camera.rotation.z += (pageRoll - camera.rotation.z) * smoothing
    if (camera.zoom !== cameraConfig.zoom) {
      const difference = cameraConfig.zoom - camera.zoom
      camera.zoom = Math.abs(difference) < 0.0001
        ? cameraConfig.zoom
        : camera.zoom + difference * smoothing
      camera.updateProjectionMatrix()
    }
  })

  return null
}

export default function Experience({ page, pageId, onNavigate, onReady, loading }) {
  if (!Number.isFinite(page.camera.zoom) || page.camera.zoom <= 0) {
    throw new Error(`Camera zoom for page "${pageId}" must be a positive number`)
  }
  const { mouseRotation } = page.camera
  if (!mouseRotation || !['pitch', 'yawNarrow', 'yawWide'].every(
    (key) => Number.isFinite(mouseRotation[key]) && mouseRotation[key] >= 0,
  ) || !Number.isFinite(mouseRotation.damping) || mouseRotation.damping <= 0) {
    throw new Error(`Camera mouse rotation for page "${pageId}" requires non-negative limits and positive damping`)
  }

  return (
    <div className="canvas-wrap" inert={loading}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 30 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        eventSource={document.body}
        eventPrefix="client"
        fallback="Your browser does not support canvas."
      >
        <CameraRig cameraConfig={page.camera} />
        <Scene pageId={pageId} onNavigate={onNavigate} onReady={onReady} />
      </Canvas>
    </div>
  )
}