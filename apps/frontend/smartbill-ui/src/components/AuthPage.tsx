// src/components/AuthPage.tsx
import { useState } from 'react'
import { authService } from '../services/authService'

export default function AuthPage({ onLoginSuccess, onGuestClick }: { onLoginSuccess: () => void, onGuestClick?: () => void }) {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isLogin) {
                await authService.login(email, password)
            } else {
                await authService.register(name, email, password)
            }
            onLoginSuccess() // Berhasil? Langsung masuk ke Home!
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f9f8] flex items-center justify-center p-5 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#1a5336] text-white rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg shadow-[#1a5336]/30">
                        💸
                    </div>
                    <h1 className="text-2xl font-bold text-dark">SmartBill</h1>
                    <p className="text-sm text-dark/50 mt-1">
                        {isLogin ? 'Masuk buat ngatur utang temen' : 'Daftar dulu biar gampang nagih'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="text-xs font-bold text-dark/70 ml-1">Nama Panggilan</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-1 bg-gray-50 border border-gray-200 text-dark rounded-xl px-4 py-3 outline-none focus:border-[#1a5336] transition-colors"
                                placeholder="Cth: Budi"
                            />
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-bold text-dark/70 ml-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 bg-gray-50 border border-gray-200 text-dark rounded-xl px-4 py-3 outline-none focus:border-[#1a5336] transition-colors"
                            placeholder="budi@email.com"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-dark/70 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 bg-gray-50 border border-gray-200 text-dark rounded-xl px-4 py-3 outline-none focus:border-[#1a5336] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1a5336] text-white font-bold py-3.5 rounded-xl mt-6 active:scale-[0.98] transition-all disabled:opacity-70"
                    >
                        {loading ? 'Tunggu bentar...' : (isLogin ? 'Masuk' : 'Daftar Sekarang')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError('') }}
                        className="text-sm font-semibold text-[#1a5336] hover:underline"
                    >
                        {isLogin ? 'Belum punya akun? Daftar sini' : 'Udah punya akun? Masuk aja'}
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); onGuestClick?.() }}
                        className="text-xs font-medium text-gray-500 hover:text-dark py-2 border border-dashed border-gray-300 rounded-lg"
                    >
                        Numpang bayar tagihan doang (Guest)
                    </button>
                </div>
            </div>
        </div>
    )
}