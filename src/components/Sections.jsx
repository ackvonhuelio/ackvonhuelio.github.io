import { useLayoutEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const SCROLL_IDLE_DELAY = 3000

const content = [
  {
    title: 'Isaac Hey',
    text: 'Scroll to continue',
    scrollPrompt: true,
    position: { top: '50%', left: '8vw' },
    persistFor: 1,
  },
  { title: '', text: '', position: {} },
  { title: '', text: '', position: {} },
  { title: '', text: '', position: { top: '50%', left: '50%' } },
]

export default function Sections({ scrollEnabled = true, loading = false }) {
  const sections = useRef(null)
  const [showScrollPrompt, setShowScrollPrompt] = useState(false)

  useEffect(() => {
    if (!scrollEnabled) return

    let timer
    const resetIdleTimer = () => {
      clearTimeout(timer)
      setShowScrollPrompt(false)
      timer = setTimeout(() => setShowScrollPrompt(true), SCROLL_IDLE_DELAY)
    }

    resetIdleTimer()
    window.addEventListener('scroll', resetIdleTimer, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', resetIdleTimer)
    }
  }, [scrollEnabled])

  let occupiedThrough = -1
  const displays = content.flatMap((item, index) => {
    if (index <= occupiedThrough || (!item.title && !item.text)) return []

    const sectionCount = Math.max(1, Math.floor(item.persistFor ?? 1))
    const endIndex = Math.min(index + sectionCount - 1, content.length - 1)
    occupiedThrough = endIndex
    return [{ item, index, endIndex, sectionCount }]
  })

  useGSAP(() => {
    const sectionElements = gsap.utils.toArray('.section', sections.current)
    displays.forEach(({ index, endIndex, sectionCount }) => {
      const copy = sectionElements[index].querySelector('.copy')
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionElements[index],
          start: 'top bottom',
          endTrigger: sectionElements[endIndex],
          end: 'bottom top',
          scrub: true,
        },
      })
      timeline
        .fromTo(copy, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' })
        .to(copy, { opacity: 1, duration: sectionCount - 1, ease: 'none' })
        .to(copy, { opacity: 0, duration: 0.2, ease: 'none' })
    })
  }, { scope: sections })

  return (
    <main className="sections" ref={sections} inert={loading}>
      {content.map((s, index) => (
        <section className="section" key={index}>
          {displays.some((display) => display.index === index) && (
            <div className="copy" style={s.position}>
              <h2>{s.title}</h2>
              <p
                className={s.scrollPrompt ? 'scroll-prompt' : undefined}
                data-visible={s.scrollPrompt ? scrollEnabled && showScrollPrompt : undefined}
                aria-hidden={s.scrollPrompt && !(scrollEnabled && showScrollPrompt) ? true : undefined}
              >
                {s.text}
              </p>
            </div>
          )}
        </section>
      ))}
    </main>
  )
}