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
import ReviewStruk from './pages/ReviewStruk' // 🌟 Jangan lupa pastiin file ini udah lu bikin

// 🌟 Bikin interface-nya langsung di sini biar gampang
export interface ScannedItem {
  item_name: string;
  qty: number;
  price: number;
  category_name: string;
}

export interface ScannedData {
  merchant_name: string;
  items: ScannedItem[];
  tax: number;
  grand_total: number;
}

type UnauthScreen = 'splash' | 'login' | 'register' | 'guest'
// Tambahin 'review' ke opsi screen lokal
type AppScreen = ScreenType | 'review' 

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [unauthScreen, setUnauthScreen] = useState<UnauthScreen>('splash')
  
  // State buat nahan layar pas AI lagi mikir
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  
  // 🌟 State buat nyimpen hasil tebakan AI sebelum di-save
  const [scannedResult, setScannedResult] = useState<ScannedData | null>(null)

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

    const handleCaptureReceipt = async (base64Image: string) => {
        setIsProcessingAI(true)
    
    try {
      const token = authService.getToken()

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
        throw new Error(data.detail || data.error || 'Gagal konek ke server AI')
      }

      if (data.status === "error") {
        alert(`🚨 Woy! ${data.message}`) 
        return 
      }
      console.log("🔥 Hasil AI Gacor:", data.data)
      setScannedResult(data.data)
      setScreen('review') 

    } catch (err: any) {
      console.error("Gagal nyambung ke server:", err)
      alert(`Error: ${err.message}`)
    } finally {
      setIsProcessingAI(false)
    }
  }

  const handleSaveToOrder = async (finalData: ScannedData) => {
    try {
      const token = authService.getToken()

      const payload = {
        name: finalData.merchant_name || "Pesanan Baru",
        items: finalData.items,
        tax: finalData.tax,
        grand_total: finalData.grand_total
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal bikin room baru cuy')
      }

      console.log("👉 Room berhasil dibuat:", data)
      alert("Mantap! Struk berhasil diamankan dan Room udah dibuat.")
      
      setScannedResult(null)
      setScreen('home')

    } catch (err: any) {
      console.error(err)
      alert(`Error: ${err.message}`)
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
    <div className="bg-[#f7f9f8] min-h-screen relative overflow-hidden">
      {screen === 'home' && <Home />}
      {screen === 'recap' && <RecapPage onBack={() => setScreen('home')} />}
      
      {screen === 'scan' && (
        <div className="relative h-full w-full">
          <ScanStruk
            onBack={() => setScreen('home')}
            onCapture={handleCaptureReceipt}
          />
          
          {/* Overlay Loading Pas AI Lagi Kerja */}
          {isProcessingAI && (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-sans font-medium animate-pulse text-accent">AI lagi baca struk, sabar cuy...</p>
            </div>
          )}
        </div>
      )}

      {/* 🌟 Layar Review Struk (Human in the loop) */}
      {screen === 'review' && scannedResult && (
        <div className="absolute inset-0 z-50 bg-white">
          <ReviewStruk 
            initialData={scannedResult}
            onCancel={() => {
              setScannedResult(null)
              setScreen('home')
            }}
            onSave={handleSaveToOrder}
          />
        </div>
      )}

      {/* Sembunyiin BottomNav kalau lagi di layar Review */}
      {screen !== 'review' && (
        <BottomNav activeScreen={screen as ScreenType} onNavigate={(s) => setScreen(s)} />
      )}
    </div>
  )
}