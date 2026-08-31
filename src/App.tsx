import { useState, useCallback, useRef } from 'react'
import Hero from './components/sections/Hero'
import Placeholder from './components/sections/Placeholder'
import Section3 from './components/sections/Section3'
import NavButton from './components/layout/NavButton'
import TransitionOverlay from './components/layout/TransitionOverlay'
import MenuPage from './components/pages/MenuPage'
import { playRandomButtonSound } from './lib/buttonSound'

type View = 'main' | 'menu'

function App() {
  const [view, setView] = useState<View>('main')
  const [transitioning, setTransitioning] = useState(false)
  // Where to land once the screen goes fully white.
  const [pendingView, setPendingView] = useState<View | null>(null)
  // Section id to scroll to after landing on the main page (if any).
  const pendingScrollRef = useRef<string | null>(null)

  // Kick off the grow-to-white transition, then switch views.
  const startTransition = useCallback(
    (target: View) => {
      if (transitioning) return
      setPendingView(target)
      setTransitioning(true)
    },
    [transitioning],
  )

  // From the menu: go back to the main page and scroll to a section.
  const goToSection = useCallback(
    (targetId: string) => {
      pendingScrollRef.current = targetId
      startTransition('main')
    },
    [startTransition],
  )

  // Called by the overlay when the screen is fully white.
  const handleTransitionComplete = useCallback(() => {
    if (pendingView) {
      setView(pendingView)

      if (pendingView === 'main') {
        const targetId = pendingScrollRef.current
        // Wait for the main page to render, then scroll to the section.
        requestAnimationFrame(() => {
          if (targetId && targetId !== 'hero') {
            document
              .getElementById(targetId)
              ?.scrollIntoView({ behavior: 'auto', block: 'start' })
          } else {
            window.scrollTo(0, 0)
          }
        })
      }
    }
    pendingScrollRef.current = null
    setPendingView(null)
    setTransitioning(false)
  }, [pendingView])

  return (
    <>
      {/* Nav button: opens the menu from main, returns home from menu */}
      <NavButton
        variant={view === 'menu' ? 'menu' : 'main'}
        onClick={() => {
          playRandomButtonSound()
          startTransition(view === 'main' ? 'menu' : 'main')
        }}
      />

      {view === 'main' ? (
        <main>
          {/* Section 1 — hero with background */}
          <Hero />

          {/* Section 2 — About Me placeholder */}
          <Placeholder id="section-2" label="Section 2" color="#f7d1d5" />

          {/* Section 3 — Projects (closet) */}
          <Section3 />

          {/* Section 4 — Contact placeholder */}
          <Placeholder id="section-4" label="Section 4" color="#d3dcf5" />
        </main>
      ) : (
        <MenuPage onSelect={goToSection} />
      )}

      {transitioning && (
        <TransitionOverlay onComplete={handleTransitionComplete} />
      )}
    </>
  )
}

export default App
