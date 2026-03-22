// src/components/GuestPage.tsx
import { useState, useEffect } from 'react'
import { fetchBillFromBackend, joinRoomGuest } from '../services/billService'
import BillDetailSheet from './BillDetailSheet'
import type { Bill } from '../types'

export default function GuestPage({ onBackToLogin }: { onBackToLogin: () => void }) {
    const [roomCode, setRoomCode] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [activeBill, setActiveBill] = useState<Bill | null>(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const codeFromUrl = urlParams.get('room')
        if (codeFromUrl) setRoomCode(codeFromUrl.toUpperCase())
    }, [])

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const success = await joinRoomGuest(roomCode, name)
        if (success) {
            const billData = await fetchBillFromBackend(roomCode)
            if (billData) setActiveBill(billData)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-[#f7f9f8] flex items-center justify-center p-5 font-sans">
            <div className="w-full max-w-sm bg-white rounded-3xl p-7 border border-black/5 shadow-sm">

                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div
                        className="w-14 h-14 bg-white rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4"
                        style={{ boxShadow: '0 0 0 4px white, 0 4px 16px rgba(34,82,62,0.25)' }}
                    >
                        👋
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-dark">Gabung Tagihan</h1>
                    <p className="text-sm text-dark/40 mt-1">Masukin kode dari temenmu</p>
                </div>

                {/* Form */}
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-dark/50 mb-1.5 ml-0.5">Kode Room</label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="w-full bg-white border border-black/10 text-dark font-mono font-bold tracking-[0.3em] text-center text-lg rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-dark/20 placeholder:tracking-normal placeholder:font-sans placeholder:font-medium placeholder:text-sm"
                            placeholder="KPK02"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-dark/50 mb-1.5 ml-0.5">Nama Kamu</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-black/10 text-dark text-sm rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-dark/25 text-center font-semibold"
                            placeholder="Siapa namamu?"
                        />
                    </div>

                    <button
                        onClick={handleJoin}
                        disabled={loading || roomCode.length < 5 || !name}
                        className="w-full bg-primary text-white text-sm font-bold py-3.5 rounded-xl mt-1 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Masuk...' : 'Gas Bayar! 🚀'}
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-black/8" />
                    <span className="text-xs text-dark/30 font-medium">atau</span>
                    <div className="flex-1 h-px bg-black/8" />
                </div>

                {/* Back to login */}
                <button
                    onClick={onBackToLogin}
                    className="w-full border border-black/10 bg-white text-dark/50 text-sm font-medium py-3 rounded-xl hover:bg-black/5 active:scale-[0.98] transition-all"
                >
                    ← Kembali ke Login
                </button>

            </div>

            <BillDetailSheet
                bill={activeBill}
                onClose={() => {
                    setActiveBill(null)
                    window.history.pushState({}, '', window.location.pathname)
                }}
            />
        </div>
    )
}