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
  
  // 🌟 State buat nahan layar pas AI lagi mikir
  const [isProcessingAI, setIsProcessingAI] = useState(false)

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

  // 🌟 Fungsi Utama buat nembak API Go
  const handleCaptureReceipt = async (base64Image: string) => {
    setIsProcessingAI(true)
    
    try {
      // Ambil token dari authService kalau ada
      const token = authService.getToken()

      // Nembak ke backend Go (Fiber)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }) 
        },
        body: JSON.stringify({ image: base64Image })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal nge-scan struk')
      }

      console.log("🔥 Hasil AI Gacor:", data.data)

      console.log("👉 Data yang dikirim ke backend:", {
        image: base64Image
      })

      // TODO: Simpan data.data ke global state/context biar bisa dipake di Home/Recap
      alert("Berhasil ekstrak! Cek console browser lu cuy.")
      
      // Pindah ke layar home atau recap setelah sukses
      setScreen('home') 

    } catch (err: any) {
      console.error(err)
      alert(`Error: ${err.message}`)
    } finally {
      setIsProcessingAI(false)
    }
  }

  // Loading Awal
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

  // Auth flow
  return (
    <div className="bg-[#f7f9f8] min-h-screen relative">
      {screen === 'home' && <Home />}
      {screen === 'recap' && <RecapPage onBack={() => setScreen('home')} />}
      
      {screen === 'scan' && (
        <div className="relative h-full w-full">
          <ScanStruk
            onBack={() => setScreen('home')}
            onCapture={handleCaptureReceipt} // 🌟 Udah kesambung API!
          />
          
          {/* Overlay Loading Pas AI Lagi Kerja */}
          {isProcessingAI && (
            <div className="absolute inset-0 bg-black/70 z-50 flex flex-col items-center justify-center text-white">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-sans font-medium animate-pulse">AI lagi baca struk, sabar cuy...</p>
            </div>
          )}
        </div>
      )}

      <BottomNav activeScreen={screen} onNavigate={setScreen} />
    </div>
  )
}