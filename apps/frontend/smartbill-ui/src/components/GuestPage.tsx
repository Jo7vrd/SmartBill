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
        if (codeFromUrl) {
            setRoomCode(codeFromUrl.toUpperCase())
        }
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
        <div className="min-h-screen bg-[#f7f9f8] flex items-center justify-center p-5 font-sans relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#1a5336]/10 rounded-full blur-3xl"></div>

            <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-sm border border-black/5 z-10">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4">
                        👋
                    </div>
                    <h1 className="text-xl font-bold text-dark">Gabung Tagihan</h1>
                    <p className="text-xs text-dark/50 mt-1">Masukin kode dari temenmu</p>
                </div>

                <form onSubmit={handleJoin} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-dark/50 uppercase tracking-wider ml-1">Kode Room</label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="w-full mt-1 bg-gray-50 border border-gray-200 text-dark font-mono font-bold tracking-widest text-center rounded-xl px-4 py-3 outline-none focus:border-[#1a5336] transition-colors"
                            placeholder="KPK02"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-dark/50 uppercase tracking-wider ml-1">Nama Kamu</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 bg-gray-50 border border-gray-200 text-dark rounded-xl px-4 py-3 outline-none focus:border-[#1a5336] transition-colors text-center font-semibold"
                            placeholder="Siapa namamu?"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || roomCode.length < 5 || !name}
                        className="w-full bg-[#1a5336] text-white font-bold py-3.5 rounded-xl mt-4 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Masuk...' : 'Gas Bayar!'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-black/5 pt-4">
                    <button onClick={onBackToLogin} className="text-xs font-semibold text-gray-400 hover:text-dark">
                        ← Kembali ke Login
                    </button>
                </div>
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