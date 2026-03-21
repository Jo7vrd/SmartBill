import { useState } from 'react'
import Home from './pages/Home'
import ScanStruk from './pages/ScanStruk'
import RecapPage from './pages/RecapPage'
import BottomNav from './components/BottomNav'
import type { ScreenType } from './components/BottomNav'

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('home')

  return (
    <div className="bg-[#f7f9f8] min-h-screen relative">

      {screen === 'home' && <Home />}
      {screen === 'recap' && <RecapPage onBack={() => setScreen('home')} />}
      {screen === 'scan' && (
        <ScanStruk
          onBack={() => setScreen('home')}
          onCapture={() => setScreen('home')}
        />
      )}

      <BottomNav activeScreen={screen} onNavigate={setScreen} />

    </div>
  )
}