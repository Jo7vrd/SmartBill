import { useState } from 'react'
import {  Mail } from 'lucide-react'
import { authService } from '../services/authService'
import ScanIcon from '../assets/icons/scan.svg?react'

{/* <ScanIcon width={16} height={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/20" /> */}

interface Props {
    onBack: () => void
    onLoginSuccess: () => void
    onDaftar: () => void
}

export default function LoginPage({ onBack, onLoginSuccess, onDaftar }: Props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            await authService.login(email, password)
            onLoginSuccess()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full bg-[#f7f9f8] border border-black/8 text-dark text-sm rounded-2xl px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-dark/25"

    return (
        <div className="min-h-screen font-sans relative" style={{ background: 'linear-gradient(to bottom, #22523E 35%, #f7f9f8 35%)' }}>

            {/* Blobs */}
            <div className="absolute w-64 h-64 rounded-full bg-white/5 -top-20 -right-16 pointer-events-none" />
            <div className="absolute w-48 h-48 rounded-full bg-white/5 top-32 -left-20 pointer-events-none" />

            {/* Hero */}
            <div className="px-6 pt-10 pb-6 relative">
                <button onClick={onBack} className="relative z-10 text-white/60 block">
                    <span className="text-5xl">‹</span>
                </button>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <ScanIcon width={60} height={60} className="text-white/20 mb-4" />
                    <h1 className="font-sans text-3xl font-bold text-white">Selamat Datang</h1>
                    <p className="text-white/50 text-sm mt-1">Masuk untuk melanjutkan ke Smart</p>
                </div>
            </div>

            {/* Card */}
            <div className="px-5 relative z-10 pb-10">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">

                    {error && (
                        <div className="bg-red-50 text-red-500 text-xs font-medium p-3 rounded-xl mb-4 text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-1.5">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`${inputClass} pr-11`}
                                    placeholder="nama@email.com"
                                />
                                <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/20" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClass}
                                placeholder="Masukkan password"
                            />
                        </div>

                        {/* Remember me + Lupa password */}
                        <div className="flex items-center justify-between pt-1">
                            <button
                                onClick={() => setRememberMe(!rememberMe)}
                                className="flex items-center gap-2 active:scale-95 transition-transform"
                            >
                                <div
                                    className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                                    style={{
                                        borderColor: rememberMe ? '#22523E' : '#ccc',
                                        background: rememberMe ? '#22523E' : 'white'
                                    }}
                                >
                                    {rememberMe && <span className="text-white text-[10px] font-bold">✓</span>}
                                </div>
                                <span className="text-xs text-dark/60 font-medium">Ingat saya</span>
                            </button>
                            <button className="text-xs font-bold text-primary">Lupa password?</button>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-4 rounded-2xl mt-1 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                            {loading ? 'Tunggu bentar...' : 'Masuk'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 py-1">
                            <div className="flex-1 h-px bg-black/8" />
                            <span className="text-xs text-dark/30 font-medium">atau</span>
                            <div className="flex-1 h-px bg-black/8" />
                        </div>

                        {/* Google */}
                        <button className="w-full bg-white border border-black/10 text-dark text-sm font-medium py-3.5 rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                            <svg width="18" height="18" viewBox="0 0 18 18">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                            </svg>
                            Lanjutkan dengan Google
                        </button>
                    </div>

                    {/* Switch to register */}
                    <p className="text-sm text-dark/40 text-center mt-5">
                        Belum punya akun?{' '}
                        <button onClick={onDaftar} className="text-primary font-bold">Daftar</button>
                    </p>
                </div>
            </div>

        </div>
    )
}