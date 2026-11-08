import { useLayoutEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children, enabled = true, loading = false }) {
  const lenisRef = useRef()

  useLayoutEffect(() => {
    const root = document.documentElement
    const body = document.body

    if (!enabled) {
      const previousScrollRestoration = window.history.scrollRestoration
      window.history.scrollRestoration = 'manual'
      root.classList.add('no-scroll')
      body.classList.add('no-scroll')

      const alignToBottom = () => {
        window.scrollTo({ top: root.scrollHeight, behavior: 'instant' })
        ScrollTrigger.update()
      }

      alignToBottom()
      window.addEventListener('pageshow', alignToBottom)
      window.addEventListener('resize', alignToBottom)

      return () => {
        window.removeEventListener('pageshow', alignToBottom)
        window.removeEventListener('resize', alignToBottom)
        root.classList.remove('no-scroll')
        body.classList.remove('no-scroll')
        window.history.scrollRestoration = previousScrollRestoration
      }
    }

    const lenis = new Lenis()
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled])

  useLayoutEffect(() => {
    if (loading) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [enabled, loading])

  return children
}