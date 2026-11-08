import { Component } from 'react'

export class SceneErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('Failed to load the 3D scene:', error)
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function LoadingScreen({ failed, exiting, onExited }) {
  return (
    <div className={`loading-screen${exiting ? ' loading-screen--exiting' : ''}`}
      onAnimationEnd={(event) => {
        if (exiting && event.target === event.currentTarget &&
            (event.animationName === 'loading-exit' || event.animationName === 'loading-exit-reduced')) {
          onExited()
        }
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}>
      {failed ? (
        <div className="loading-screen__content" role="alert">
          <p className="loading-screen__title">&gt; LOADING FAILED</p>
          <p>Unable to load the 3D scene.</p>
          <button type="button" onClick={() => window.location.reload()}>RETRY</button>
        </div>
      ) : (
        <div className="loading-screen__content" role="status">
          <p className="loading-screen__title" data-glitch-text="> LOADING...">&gt; LOADING<span className="loading-screen__dots" aria-hidden="true">...</span></p>
        </div>
      )}
    </div>
  )
}
