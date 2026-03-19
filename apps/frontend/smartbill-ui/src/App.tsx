import { useState, useEffect } from 'react'
import Home from './pages/Home'
import ScanStruk from './pages/ScanStruk'
import AuthPage from './components/AuthPage'
import GuestPage from './components/GuestPage'
import { authService } from './services/authService'
type Screen = 'home' | 'scan'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [screen, setScreen] = useState<Screen>('home')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('room')) {
      setIsGuestMode(true)
    }
    const token = authService.getToken()
    if (token) setIsAuthenticated(true)

    setIsChecking(false)
  }, [])

  const handleCapture = (img: string) => {
    console.log('captured:', img)
  }

  if (isChecking) return <div className="min-h-screen bg-[#f7f9f8]" />

  if (isGuestMode) {
    return <GuestPage onBackToLogin={() => setIsGuestMode(false)} />
  }
  if (!isAuthenticated) {
    return (
      <AuthPage
        onLoginSuccess={() => setIsAuthenticated(true)}
        onGuestClick={() => setIsGuestMode(true)}
      />
    )
  }

  if (screen === 'scan') {
    return <ScanStruk onBack={() => setScreen('home')} onCapture={handleCapture} />
  }
  return <Home onScan={() => setScreen('scan')} />
}