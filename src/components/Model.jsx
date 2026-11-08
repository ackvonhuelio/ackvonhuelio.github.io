import { Suspense, useLayoutEffect, useRef, useState } from 'react'
import { Image, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import chickenGameThumbnail from './thumbnails/chickenGameThumbnail.png';
import crabApplesThumbnail from './thumbnails/crabApplesThumbnail.png';
import littleAlchemyThumbnail from './thumbnails/littleAlchemyThumbnail.png';
import cbrpnkThumbnail from './thumbnails/cbrpnkThumbnail.png';
import sevenWondersThumbnail from './thumbnails/sevenWondersThumbnail.png';

let projectData = [
    {
      name:'Super Chicken Game',
      date:'2022',
      description:'A roguelite game where you create a team\nof chickens to automatically fight\nteams of chickens created by others.',
      description2:'~2 years\nCustom string parser/interpreter\nPassion project',
      link:'https://ackvonhuelio.github.io/superchickengame/',
      img:chickenGameThumbnail,
      kaLink:'https://www.khanacademy.org/computer-programming/super-chicken-game/5675550710546432',
    },
    {
      name:'Crab Apples',
      date:'2023',
      description:'A fast-paced and high skill game where\nyou try to be the last crab apple\nstanding.',
      description2:'Raycasting and efficient rendering\n~2 Weeks\nHighly advanced bots',
      link:'https://ackvonhuelio.github.io/crabapples/',
      img:crabApplesThumbnail,
      kaLink:'https://www.khanacademy.org/computer-programming/crab-apples-coc/6741196300009472',
    },
    {
      name:'Little Alchemy (KA)',
      date:'2024',
      description:'A recreation of the game Little Alchemy\nwith 580 craftable elements.',
      description2:'~3 days\nEfficient data structuring',
      link:'https://ackvonhuelio.github.io/littlealchemy/',
      img: littleAlchemyThumbnail,
      kaLink:'https://www.khanacademy.org/computer-programming/little-alchemy/6383216485122048',
    },
    {
      name:'CBRPNK',
      date:'2025',
      description:'A rethemed clone of the game Slay the\nSpire, a roguelite deckbuilder.',
      description2:'~2 weeks\nExtensive enemy design and animation\nUltra smooth UI/UX',
      link:'https://ackvonhuelio.github.io/cbrpnk/',
      img:cbrpnkThumbnail,
      kaLink:'https://www.khanacademy.org/computer-programming/cbrpnk-roguelikecoc/6628674163556352',
    },
    {
      name:'7 Wonders',
      date:'2025',
      description:'A 100% remake of the hit board game\n7 Wonders.',
      description2:'~A few months\nAdvanced bots, A* for optimized moves\nKhan Academy contest: Time winner',
      link:'https://ackvonhuelio.github.io/7wonders/',
      img:sevenWondersThumbnail,
      kaLink:'https://www.khanacademy.org/computer-programming/seven-wonders-game/4999333090017280',
    },
    
  ];

gsap.registerPlugin(useGSAP, ScrollTrigger)

const TEXT_LINK = 'https://github.com/ackvonhuelio'
const EMAIL = 'isaachey9092@gmail.com'
const DISCORD = 'ackvonhey'

const START = {
  position: [0, 0.8, -1],
  rotation: [0, Math.PI*0.1, 0],
  scale: 0.5,
}

import { Box3 } from 'three'
import TerminalText, { flickerEase } from './TerminalText'

function ProjectImage({ url, href }) {
  const image = useRef()
  const hovered = useRef(false)
  const distortion = useRef({ time: { value: 0 }, amount: { value: 1 } })

  useFrame((_, delta) => {
    distortion.current.time.value += delta
  })

  useLayoutEffect(() => {
    const material = image.current.material
    const uniforms = distortion.current
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uImageTime = uniforms.time
      shader.uniforms.uImageGlitch = uniforms.amount
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `uniform float uImageTime;
        uniform float uImageGlitch;
        void main() {`,
      ).replace(
        'gl_FragColor = toGrayscale(texture2D(map, zUv)',
        `float imageBand = floor((vUv.y + uImageTime * 0.15) * 40.0);
        float imageHash = fract(sin(imageBand * 91.7 + floor(uImageTime * 12.0) * 17.3) * 43758.5453);
        float imageThreshold = 0.885;
        float imageShift = step(imageThreshold, imageHash) * (imageHash - imageThreshold) * 2.0 * uImageGlitch;
        gl_FragColor = toGrayscale(texture2D(map, vec2(clamp(zUv.x + imageShift, 0.0, 1.0), zUv.y))`,
      ).replace(
        '#include <colorspace_fragment>',
        `#include <colorspace_fragment>
        float hueCos = cos(-2.09439510239);
        float hueSin = sin(-2.09439510239);
        vec3 sourceColor = gl_FragColor.rgb;
        gl_FragColor.rgb = vec3(
          dot(sourceColor, vec3(0.213 + hueCos * 0.787 - hueSin * 0.213, 0.715 - hueCos * 0.715 - hueSin * 0.715, 0.072 - hueCos * 0.072 + hueSin * 0.928)),
          dot(sourceColor, vec3(0.213 - hueCos * 0.213 + hueSin * 0.143, 0.715 + hueCos * 0.285 + hueSin * 0.140, 0.072 - hueCos * 0.072 - hueSin * 0.283)),
          dot(sourceColor, vec3(0.213 - hueCos * 0.213 - hueSin * 0.787, 0.715 - hueCos * 0.715 + hueSin * 0.715, 0.072 + hueCos * 0.928 + hueSin * 0.072))
        );`,
      )
    }
    material.needsUpdate = true
    const reveal = gsap.timeline()
      .fromTo(material, { opacity: 0 }, {
        opacity: 0.75,
        duration: 0.8,
        ease: flickerEase(30, 0.9),
      })
      .to(uniforms.amount, { value: 0, duration: 0.8, ease: 'power1.out' }, 0)
    return () => {
      reveal.kill()
      if (hovered.current) document.body.style.cursor = ''
    }
  }, [])

  return (
    <Image
      ref={image}
      url={url}
      position={[0.34, 0.081, 3.57]}
      rotation={[0.05, -0.23, 0.07]}
      scale={[0.06, 0.06]}
      transparent
      opacity={0}
      toneMapped={false}
      onClick={() => {
        if (image.current.material.opacity > 0) window.open(href, '_blank', 'noopener,noreferrer')
      }}
      onPointerOver={() => {
        if (image.current.material.opacity > 0) {
          hovered.current = true
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={() => {
        if (hovered.current) document.body.style.cursor = ''
        hovered.current = false
      }}
    />
  )
}

function useCopyContact(value, label, pageId) {
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef()
  const copyRequest = useRef(0)

  useLayoutEffect(() => {
    setCopied(false)
    return () => {
      copyRequest.current += 1
      clearTimeout(copyTimer.current)
    }
  }, [pageId])

  const copy = async () => {
    const request = ++copyRequest.current
    clearTimeout(copyTimer.current)
    setCopied(false)
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard access is unavailable')
      }
      await navigator.clipboard.writeText(value)
      if (copyRequest.current !== request) return
      setCopied(true)
      copyTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error(`Failed to copy ${label}:`, error)
      if (copyRequest.current === request) {
        window.alert(`Could not copy ${label}. Please copy it manually.`)
      }
    }
  }

  return [copied, copy]
}

export default function Model({ pageId, onNavigate }) {
  const group = useRef()
  const spinner = useRef()
  const plane = useRef()
  const [showText, setShowText] = useState(false)
  const [curProject, setCurProject] = useState(0);
  const [emailCopied, copyEmail] = useCopyContact(EMAIL, 'the email address', pageId)
  const [discordCopied, copyDiscord] = useCopyContact(DISCORD, 'the Discord username', pageId)
  const { scene } = useGLTF('/models/model.glb')

  useLayoutEffect(() => {
    const box = new Box3().setFromObject(scene)
    plane.current.position.y = box.min.y
  }, [scene])

  
  useGSAP(() => {
    const g = group.current
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.sections', start: 'top top', end: '90% bottom', scrub: 1 },
    })

    tl.to(g.rotation, { x: Math.PI*0.1, y: -Math.PI*0.1, z:0, ease: 'power1.inOut', duration: 0.8}, 0)
      .to(g.position, { x: -1.05, y: 0.8, z:-1, ease: 'power1.inOut', duration: 0.8}, 0)
      .to(g.scale, { x: 0.5, y: 0.5, z: 0.5, ease: 'power1.inOut', duration: 1}, 0)

      .to(g.rotation, { x: -Math.PI*0.1, y: -Math.PI*0.1, z:0, ease: 'power1.inOut', duration: 1}, 1)
      .to(g.position, { x: -1.8, y: 0.4, z:2.2, ease: 'power1.inOut', duration: 1}, 1)
      .to(g.scale, { x: 0.8, y: 0.8, z: 0.8, ease: 'power1.inOut', duration: 1}, 1)

      .to(g.position, { x: -1.8, y: 0.8, z:2.2, ease: 'power1.inOut', duration: 1}, 2)


    const textTrigger = ScrollTrigger.create({
      trigger: '.sections',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setShowText(self.progress >= 0.90),
    })
    setShowText(textTrigger.progress >= 0.90)
  }, [])

  return (
    <>
    <group ref={group} position={START.position} scale={START.scale}>
      <group ref={spinner} rotation={START.rotation}>
        <primitive object={scene} />


      <mesh ref={plane} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[20, 64]} />
        <meshBasicMaterial color="#141300" toneMapped={false} fog={false} />
        </mesh>
      </group>
    </group>

    <TerminalText
      revealed={showText}
      position={[0.015, 0.045, 3.6]}
      rotation={[0, 0, 0]}
      animateOnChange
      reloadKey={pageId}
      onActivate={pageId !== 'home' ? () =>  {onNavigate('home')} : undefined }
      href={TEXT_LINK}
    >
      {pageId === 'home' ? '> ACKVONHEY' : '> BACK'}
    </TerminalText>
     <TerminalText revealed={showText} position={[-0.26, 0.083, 3.6]} rotation={[0, 0.2, -0.1]}
     onActivate={() => onNavigate('about')}
     hitbox={[0.05,0.03]}
     animateOnChange
    //  reloadKey={pageId}
     visible={pageId !== 'about' && pageId !== 'about2'}
     >
      ABOUT
    </TerminalText>
    <TerminalText revealed={showText} position={[-0.26, 0.123, 3.6]} rotation={[0, 0.2, -0.11]}
     hitbox={[0.05,0.03]}
     animateOnChange
    //  reloadKey={pageId}
     visible={pageId === 'about'}
     >
      {'ISAAC HEY'}
    </TerminalText>
    <TerminalText revealed={showText} position={[-0.261, 0.085, 3.6]} rotation={[0, 0.2, -0.11]}
     hitbox={[0.05,0.03]}
     animateOnChange
    //  reloadKey={pageId}
    depth={0.01}
     size={0.012}
     visible={pageId === 'about'}
     >
      {'CS Major at Cal Poly SLO\nDriven to learn\nFueled by instant noodles'}
    </TerminalText>
    <TerminalText revealed={showText} position={[-0.261, 0.085, 3.6]} rotation={[0, 0.2, -0.11]}
     hitbox={[0.05,0.03]}
     animateOnChange
    //  reloadKey={pageId}
     size={0.012}
     depth={0.01}
     visible={pageId === 'about2'}
     >
      {'Introduced to CS at a very young\nage, this freakish specimen yearns\nfor endless hours behind a keyboard'}
    </TerminalText>
    <TerminalText revealed={showText} position={[-0.275, 0.04, 3.6]} rotation={[0, 0.2, -0.11]}
     onActivate={() => onNavigate('about2')}
     hitbox={[0.05,0.03]}
     animateOnChange
    //  reloadKey={pageId}
     visible={pageId === 'about'}
     >
      {'> MORE'}
    </TerminalText>
    <TerminalText revealed={showText} position={[-0.275, 0.04, 3.6]} rotation={[0, 0.2, -0.11]}
     onActivate={() => onNavigate('about')}
     hitbox={[0.05,0.03]}
     animateOnChange
    //  reloadKey={pageId}
     visible={pageId === 'about2'}
     >
      {'> LESS'}
    </TerminalText>



    {pageId === 'projects' && showText && (
      <Suspense key={curProject} fallback={null}>
        <ProjectImage url={projectData[curProject].img} href={projectData[curProject].link}/>
      </Suspense>
    )}
    <TerminalText revealed={showText}  rotation={[0.05, -0.23, 0.07]}
     hitbox={[0.07,0.03]}
     position={pageId === 'projects' ? [0.327, 0.158, 3.6] : [0.33, 0.108, 3.6]}
     onActivate={pageId !== 'projects' ? () => onNavigate('projects') : undefined}
     animateOnChange
    //  reloadKey={pageId}
     >
      {pageId === 'projects' ?'PROJECT '+(curProject+1)+'/'+projectData.length : 'PROJECTS'}
    </TerminalText>
    <TerminalText revealed={showText}  rotation={[0, -0.43, 0.135]}
     hitbox={[0.07,0.03]}
     position={[0.6, 0.178, 3.6]}
     animateOnChange
    //  reloadKey={pageId}
     visible={pageId === 'projects'}
     >
      {'INFO'}
    </TerminalText>
    <TerminalText revealed={showText}  rotation={[0, -0.43, 0.135]}
     hitbox={[0.07,0.03]}
     position={[0.6035, 0.158, 3.6]}
     animateOnChange
    //  reloadKey={pageId}
     visible={pageId === 'projects'}
     >
      {projectData[curProject].date}
    </TerminalText>
     <TerminalText revealed={showText}  rotation={[0, -0.43, 0.135]}
     hitbox={[0.07,0.03]}
     position={[0.681, 0.133, 3.6]}
     animateOnChange
     size={0.012}
    //  reloadKey={pageId}
     depth={0.01}
     visible={pageId === 'projects'}
     >
      {projectData[curProject].description}
    </TerminalText>
    <TerminalText revealed={showText}  rotation={[0, -0.43, 0.135]}
     hitbox={[0.07,0.03]}
     position={[0.685, 0.088, 3.6]}
     animateOnChange
     size={0.012}
     depth={0.01}
    //  reloadKey={pageId}
     visible={pageId === 'projects'}
     >
      {projectData[curProject].description2}
    </TerminalText>
    <TerminalText revealed={showText}  rotation={[0.1, -0.23, 0.08]}
     hitbox={[projectData[curProject].name.length*0.009,0.03]}
     position={[0.329, 0.129, 3.6]}
     animateOnChange
    //  reloadKey={pageId}
     href={projectData[curProject].link}
     visible={pageId === 'projects'}
     >
      {projectData[curProject].name}
    </TerminalText>
    <TerminalText revealed={showText}  rotation={[0, -0.23, 0.065]}
     hitbox={[0.02,0.02]}
     position={[0.42, 0.06, 3.6]}
     onActivate={() => setCurProject((curProject+1)%projectData.length)}
     animateOnChange
    //  reloadKey={pageId}
     visible={pageId === 'projects'}
     >
      {'>>'}
    </TerminalText>
    <TerminalText revealed={showText}  rotation={[0, -0.23, 0.065]}
     hitbox={[0.02,0.02]}
     position={[0.254, 0.048, 3.6]}
     onActivate={() => setCurProject((curProject <= 0)?(projectData.length-1):(curProject-1))}
     animateOnChange
    //  reloadKey={pageId}
     visible={pageId === 'projects'}
     >
      {'<<'}
    </TerminalText>



    <TerminalText revealed={showText} visible={pageId !== 'experience' && pageId !== 'skills'} position={[0.032, -0.202, 3.6]} rotation={[-0.1, 0, 0]}
     hitbox={[0.09,0.03]}
     animateOnChange
    //  reloadKey={pageId}
    onActivate={() =>  {onNavigate('experience')}}
     >
    {'EXPERIENCE'}

    </TerminalText>

    <TerminalText revealed={showText} visible={pageId === 'experience'} position={[0.032, -0.252, 3.6]} rotation={[-0.1, 0, 0]}
     hitbox={[0.08,0.03]}
     animateOnChange
    //  reloadKey={pageId}
    onActivate={() =>  {onNavigate('skills')}}
     >
    {'> SKILLS'}
    </TerminalText>
    <TerminalText revealed={showText} visible={pageId === 'skills'} position={[0.032, -0.252, 3.6]} rotation={[-0.1, 0, 0]}
     hitbox={[0.11,0.03]}
     animateOnChange
    //  reloadKey={pageId}
    onActivate={() =>  {onNavigate('experience')}}
     >
    {'> EXPERIENCE'}
    </TerminalText>
    
    <TerminalText revealed={showText} visible={pageId === 'experience'} position={[0.032, -0.152, 3.6]} rotation={[-0.1, 0, 0]}
     hitbox={[0.11,0.03]}
     animateOnChange
    //  reloadKey={pageId}
    size={0.012}
     >
    {'Independent developer > 2020-Present'}
    </TerminalText>
    <TerminalText revealed={showText} visible={pageId === 'experience'} position={[0.032, -0.172, 3.6]} rotation={[-0.1, 0, 0]}
     hitbox={[0.14,0.01]}
     animateOnChange
    //  reloadKey={pageId}
    size={0.012}
    href={"https://www.thecoderschool.com/locations/southbay/"}
     >
    {'The Coder School SB > 2025-2026'}
    </TerminalText>
    <TerminalText revealed={showText} visible={pageId === 'experience'} position={[0.032, -0.192, 3.6]} rotation={[-0.1, 0, 0]}
     hitbox={[0.14,0.01]}
     animateOnChange
    //  reloadKey={pageId}
    size={0.012}
    href={"https://calpoly.hack4impact.org"}
     >
    {'Hack 4 Impact > 2026-Present'}
    </TerminalText>

<TerminalText revealed={showText} visible={pageId === 'skills'} position={[0.032, -0.172, 3.6]} rotation={[-0.1, 0, 0]}
     hitbox={[0.11,0.03]}
     animateOnChange
    //  reloadKey={pageId}
    size={0.012}
     >
    {'Javascript - React - proficient\nHTML/CSS - proficient\nJava - intermediate\nTypeScript - intermediate'}
    </TerminalText>


    <TerminalText revealed={showText} position={[0.025, 0.365, 3.3]} rotation={[0.4, 0, -0.02]}
     hitbox={[0.07,0.03]}
     onActivate={() => onNavigate('contact')}
     depth={0.01}
     animateOnChange
    //  reloadKey={pageId}
     size={0.022}
     visible={pageId !== 'contact'}
     >
      CONTACT
    </TerminalText>
    <TerminalText revealed={showText} position={[0.025, 0.395, 3.3]} rotation={[0.4, 0, -0.02]}
     hitbox={[0.18,0.04]}
     onActivate={copyEmail}
     depth={0.01}
     animateOnChange
    //  reloadKey={pageId}
     size={0.02}
     visible={pageId === 'contact'}
     >
      {`EMAIL${emailCopied ? ' - COPIED' : ''}\n${EMAIL}`}
    </TerminalText>
    <TerminalText revealed={showText} position={[0.025, 0.335, 3.3]} rotation={[0.4, 0, -0.02]}
     hitbox={[0.13,0.04]}
     onActivate={copyDiscord}
     animateOnChange
     //  reloadKey={pageId}
     depth={0.01}
     size={0.02}
     visible={pageId === 'contact'}
     >
      {`DISCORD${discordCopied ? ' - COPIED' : ''}\n${DISCORD+'  fblthp#2004'}`}
    </TerminalText>

    </>
  )
}

useGLTF.preload('/models/model.glb')