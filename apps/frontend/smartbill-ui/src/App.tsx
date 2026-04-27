import { useState, useEffect } from 'react'
import Home from './pages/Home'
import ScanStruk from './pages/ScanStruk'
import RecapPage from './pages/RecapPage'
import SplashPage from './pages/SplashPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BottomNav from './components/BottomNav'
import type { ScreenType } from './components/BottomNav'
import { authService } from './services/authService'
import GuestPage from './components/GuestPage'

type UnauthScreen = 'splash' | 'login' | 'register' | 'guest'

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [unauthScreen, setUnauthScreen] = useState<UnauthScreen>('splash')

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = authService.getUser()
      setIsAuthenticated(!!user)
      setIsCheckingAuth(false)

      const urlParams = new URLSearchParams(window.location.search)
      if (!user && urlParams.get('room')) {
        setUnauthScreen('guest')
      }
    }

    checkLoginStatus()
  }, [])

  // Loading
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Unauth flow
  if (!isAuthenticated) {
    if (unauthScreen === 'guest') {
      return <GuestPage onBackToLogin={() => setUnauthScreen('login')} />
    }

    if (unauthScreen === 'login') {
      return (
        <LoginPage
          onBack={() => setUnauthScreen('splash')}
          onLoginSuccess={() => setIsAuthenticated(true)}
          onDaftar={() => setUnauthScreen('register')}
        />
      )
    }

    if (unauthScreen === 'register') {
      return (
        <RegisterPage
          onBack={() => setUnauthScreen('splash')}
          onRegisterSuccess={() => setIsAuthenticated(true)}
          onMasuk={() => setUnauthScreen('login')}
        />
      )
    }

    // Default: splash
    return (
      <SplashPage
        onMulai={() => setUnauthScreen('register')}
        onMasuk={() => setUnauthScreen('login')}
        onGabung={() => setUnauthScreen('guest')}
      />
    )
  }

  // Auth flow — sama persis kayak sebelumnya
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