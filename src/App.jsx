import { useEffect, useLayoutEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import SmoothScroll from './components/SmoothScroll'
import Experience from './components/Experience'
import Sections from './components/Sections'
import LoadingScreen, { SceneErrorBoundary } from './components/LoadingScreen'
import { getPageIdFromPath, PAGES } from './pageConfig'

export default function App() {
  const [pageId, setPageId] = useState(() => getPageIdFromPath(window.location.pathname))
  const [sceneReady, setSceneReady] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [transitionComplete, setTransitionComplete] = useState(false)
  const errors = useProgress((state) => state.errors)
  const failed = sceneFailed || errors.length > 0
  const loading = !transitionComplete || failed

  useLayoutEffect(() => {
    if (!loading) return
    document.documentElement.classList.add('loading')
    return () => document.documentElement.classList.remove('loading')
  }, [loading])

  useEffect(() => {
    const syncPage = () => setPageId(getPageIdFromPath(window.location.pathname))
    window.addEventListener('popstate', syncPage)
    return () => window.removeEventListener('popstate', syncPage)
  }, [])

  const navigateToPage = (nextPageId) => {
    const nextPage = PAGES[nextPageId]
    if (!nextPage) throw new Error(`Unknown page: ${nextPageId}`)

    if (window.location.pathname !== nextPage.path) {
      window.history.pushState({}, '', nextPage.path)
    }
    setPageId(nextPageId)
  }

  return (
    <SmoothScroll enabled={PAGES[pageId].scroll} loading={loading}>
      <SceneErrorBoundary onError={() => setSceneFailed(true)}>
        <Experience page={PAGES[pageId]} pageId={pageId} onNavigate={navigateToPage} loading={loading}
          onReady={() => setSceneReady(true)} />
      </SceneErrorBoundary>
      <Sections scrollEnabled={PAGES[pageId].scroll && !loading} loading={loading} />
      {loading && (
        <LoadingScreen failed={failed} exiting={sceneReady && !failed}
          onExited={() => setTransitionComplete(true)} />
      )}
    </SmoothScroll>
  )
}