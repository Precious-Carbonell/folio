import { useState, useCallback, useRef } from 'react'
import Hero from './components/sections/Hero'
import Placeholder from './components/sections/Placeholder'
import Section2 from './components/sections/Section2'
import Section3 from './components/sections/Section3'
import NavButton from './components/layout/NavButton'
import TransitionOverlay from './components/layout/TransitionOverlay'
import RoomDeck from './components/layout/RoomDeck'
import BgMusic from './components/layout/BgMusic'
import MenuPage from './components/pages/MenuPage'
import { playRandomButtonSound } from './lib/buttonSound'

type View = 'main' | 'menu'

// Rooms in order, and the menu target id that maps to each room index.
const ROOM_IDS = ['hero', 'section-2', 'section-3', 'section-4'] as const

function App() {
  const [view, setView] = useState<View>('main')
  const [roomIndex, setRoomIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  // Where to land once the screen goes fully white.
  const [pendingView, setPendingView] = useState<View | null>(null)
  // Room index to land on after returning to the main view (if any).
  const pendingRoomRef = useRef<number | null>(null)

  // Kick off the grow-to-white transition, then switch views.
  const startTransition = useCallback(
    (target: View) => {
      if (transitioning) return
      setPendingView(target)
      setTransitioning(true)
    },
    [transitioning],
  )

  // From the menu: go back to the main view and open a specific room.
  const goToSection = useCallback(
    (targetId: string) => {
      const idx = ROOM_IDS.indexOf(targetId as (typeof ROOM_IDS)[number])
      pendingRoomRef.current = idx >= 0 ? idx : 0
      startTransition('main')
    },
    [startTransition],
  )

  // Called by the overlay when the screen is fully white.
  const handleTransitionComplete = useCallback(() => {
    if (pendingView) {
      setView(pendingView)
      if (pendingView === 'main' && pendingRoomRef.current !== null) {
        setRoomIndex(pendingRoomRef.current)
      }
    }
    pendingRoomRef.current = null
    setPendingView(null)
    setTransitioning(false)
  }, [pendingView])

  // A room only counts as "active" when it's the current room and we're
  // on the main view (not the menu).
  const isMain = view === 'main'
  const rooms = [
    <Hero key="hero" active={isMain && roomIndex === 0} />,
    <Section2 key="section-2" active={isMain && roomIndex === 1} />,
    <Section3 key="section-3" />,
    <Placeholder key="section-4" id="section-4" label="Section 4" color="#d3dcf5" />,
  ]

  return (
    <>
      {/* Quiet looping background music */}
      <BgMusic />

      {/* Nav button: opens the menu from main, returns home from menu */}
      <NavButton
        variant={view === 'menu' ? 'menu' : 'main'}
        onClick={() => {
          playRandomButtonSound()
          startTransition(view === 'main' ? 'menu' : 'main')
        }}
      />

      {view === 'main' ? (
        <RoomDeck rooms={rooms} activeIndex={roomIndex} onChange={setRoomIndex} />
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
