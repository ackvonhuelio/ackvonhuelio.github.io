import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, Text3D } from '@react-three/drei'
import gsap from 'gsap'

const hash = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

export const flickerEase = (steps = 24, depth = 1) => (p) => {
  if (p <= 0) return 0
  if (p >= 1) return 1
  const r = hash(Math.floor(p * steps))
  const flick = r < p ? 1 : 0
  return p + (flick - p) * depth
}

gsap.registerEase('flicker', flickerEase(30, 0.9))

const patchMonitorDistortion = (uniforms) => (shader) => {
  shader.uniforms.uTime = uniforms.uTime
  shader.uniforms.uGlitchAmount = uniforms.uGlitchAmount

  shader.vertexShader = shader.vertexShader
    .replace(
      'void main() {',
      'varying float vScreenY;\nuniform float uTime;\nuniform float uGlitchAmount;\nvoid main() {',
    )
    .replace(
      '#include <project_vertex>',
      `#include <project_vertex>
      float ndcY = gl_Position.y / gl_Position.w;
      float band = floor((ndcY + uTime * 0.15) * 40.0);
      float h = fract(sin(band * 91.7 + floor(uTime * 12.0) * 17.3) * 43758.5453);
      float threshold = 0.985 - (uGlitchAmount - 1.0) * 0.025;
      float glitch = step(threshold, h) * (h - threshold) * 0.4 * uGlitchAmount;
      float wobble = sin(ndcY * 30.0 + uTime * 4.0) * 0.00008; // barely-there horizontal wave
      gl_Position.x += (glitch + wobble) * gl_Position.w;
      vScreenY = ndcY;`,
    )

  shader.fragmentShader = shader.fragmentShader
    .replace('void main() {', 'varying float vScreenY;\nuniform float uTime;\nvoid main() {')
    .replace(
      '#include <opaque_fragment>',
      `#include <opaque_fragment>
      float scan = 0.65 + 0.35 * sin(gl_FragCoord.y * 3.14159);            // scanlines
      float roll = 0.8 + 0.2 * sin(vScreenY * 6.0 - uTime * 2.0);          // slow rolling bar
      float flick = 0.94 + 0.06 * sin(uTime * 60.0);                        // refresh flicker
      gl_FragColor.a *= scan * roll * flick;`,
    )
}

export default function TerminalText({
  children,
  revealed = false,
  visible = true,
  href,
  onActivate,
  animateOnChange = false,
  reloadKey,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = 0.02,
  depth = 0.02,
  hitbox = [0.09, 0.03],
  color = '#413d03',
  font = '/fonts/vt323_regular.typeface.json',
}) {
  const material = useRef()
  const visual = useRef()
  const reveal = useRef()
  const hovered = useRef(false)
  const opacity = useRef({ value: 0 })
  const previousVisible = useRef(visible)
  const visibilityVersion = useRef(0)
  const displayed = useRef({ children, reloadKey, visibilityVersion: 0 })
  const [displayedText, setDisplayedText] = useState(() => ({ children, reloadKey, visibilityVersion: 0 }))
  const distortion = useRef({
    uTime: { value: 0 },
    uGlitchAmount: { value: 1 },
  })
  const onBeforeCompile = useRef(patchMonitorDistortion(distortion.current))

  useFrame((_, delta) => {
    distortion.current.uTime.value += delta
    if (material.current) material.current.opacity = opacity.current.value
  })

  useEffect(() => {
    reveal.current = gsap.to(opacity.current, {
      value: 1, duration: 0.8, ease: 'flicker', paused: true,
    })
    return () => reveal.current.kill()
  }, [])

  useEffect(() => {
    if (revealed) reveal.current.play()
    else reveal.current.pause(0)
  }, [revealed])

  useLayoutEffect(() => {
    if ((!visible || !revealed) && hovered.current) {
      document.body.style.cursor = ''
      hovered.current = false
    }
  }, [visible, revealed])

  useEffect(() => () => {
    if (hovered.current) document.body.style.cursor = ''
  }, [])

  useEffect(() => {
    const becameVisible = visible && !previousVisible.current
    previousVisible.current = visible
    if (becameVisible) visibilityVersion.current += 1

    const nextText = { children, reloadKey, visibilityVersion: visibilityVersion.current }
    const updateText = () => {
      displayed.current = nextText
      setDisplayedText(nextText)
    }

    if (children === displayed.current.children &&
        reloadKey === displayed.current.reloadKey &&
        nextText.visibilityVersion === displayed.current.visibilityVersion) {
      distortion.current.uGlitchAmount.value = 1
      visual.current.scale.setScalar(1)
      if (revealed && reveal.current.paused()) opacity.current.value = 1
      return
    }

    if (!animateOnChange || !revealed || !visible) {
      distortion.current.uGlitchAmount.value = 1
      visual.current.scale.setScalar(1)
      if (revealed && reveal.current.paused()) opacity.current.value = 1
      updateText()
      return
    }

    reveal.current.pause()
    const timeline = gsap.timeline()
    timeline
      .to(distortion.current.uGlitchAmount, {
        value: 5,
        duration: 0.18,
        ease: 'steps(5)',
      })
      .to(opacity.current, { value: 0, duration: 0.06, ease: 'steps(3)' }, '<0.1')
      .call(() => {
        updateText()
        visual.current.scale.setScalar(0.75)
      })
      .to(visual.current.scale, { x: 1, y: 1, z: 1, duration: 0.22, ease: 'back.out(1.7)' })
      .to(opacity.current, { value: 1, duration: 0.22, ease: 'power1.out' }, '<')
      .to(distortion.current.uGlitchAmount, {
        value: 1,
        duration: 0.35,
        ease: 'steps(8)',
      }, '<')

    return () => timeline.kill()
  }, [animateOnChange, children, reloadKey, revealed, visible])

  const canInteract = () => visible && revealed && opacity.current.value > 0

  return (
    <group position={position} rotation={rotation} visible={visible}>
      <group ref={visual}>
        <group key={displayedText.visibilityVersion}>
          <Center key={displayedText.reloadKey} cacheKey={displayedText.children}>
            <Text3D font={font} size={size} height={depth}>
              {displayedText.children}
              <meshBasicMaterial
                ref={material}
                color={color}
                transparent
                opacity={0}
                toneMapped={false}
                onBeforeCompile={onBeforeCompile.current}
              />
            </Text3D>
          </Center>
        </group>
      </group>

      {visible && revealed && (href || onActivate) && (
        <mesh
          position={[0, 0, depth]}
          onClick={() => {
            if (!canInteract()) return
            if (onActivate) onActivate()
            else window.open(href, '_blank', 'noopener,noreferrer')
          }}
          onPointerOver={() => {
            if (canInteract()) {
              hovered.current = true
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            if (hovered.current) document.body.style.cursor = ''
            hovered.current = false
          }}
        >
          <planeGeometry args={hitbox} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}
