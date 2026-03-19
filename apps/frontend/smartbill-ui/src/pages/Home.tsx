import { useState, useEffect } from 'react'
import BillCard from '../components/BillCard'
import BillDetailSheet from '../components/BillDetailSheet'
import type { Bill } from '../types'
import { fetchBillFromBackend, fetchUserBills, joinRoomSelf } from '../services/billService'
import { authService } from '../services/authService'

interface Props {
  onScan: () => void
}

export default function Home({ onScan }: Props) {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)

  const [bills, setBills] = useState<Bill[]>([])
  const [myDebt, setMyDebt] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const currentUser = authService.getUser()
  const userInitials = currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : '👤'

  const [isJoining, setIsJoining] = useState(false)
  const [roomCodeInput, setRoomCodeInput] = useState('')

  const loadBills = async () => {
    setIsLoading(true)

    const userHistory = await fetchUserBills()
    setBills(userHistory)

    const activeRooms = userHistory.filter(b => b.status === 'splitting')
    let totalHutangku = 0

    if (activeRooms.length > 0 && currentUser?.id) {
      const fullActiveBills = await Promise.all(
        activeRooms.map(b => fetchBillFromBackend(b.roomCode))
      )

      fullActiveBills.forEach(fullBill => {
        if (!fullBill) return

        const me = fullBill.members.find(m => m.userId === currentUser.id)

        if (me && !me.hasPaid) {
          let utangDiRoomIni = 0

          fullBill.items.forEach(item => {
            if (item.assignedTo.includes(me.id)) {
              utangDiRoomIni += item.price / item.assignedTo.length
            }
          })

          totalHutangku += utangDiRoomIni
        }
      })
    }

    setMyDebt(totalHutangku)
    setIsLoading(false)
  }

  useEffect(() => {
    loadBills()
  }, [])

  const handleOpenBill = async (roomCode: string) => {
    const fullBillData = await fetchBillFromBackend(roomCode)
    if (fullBillData) {
      setSelectedBill(fullBillData)
    } else {
      alert('Yahh, room tidak ditemukan atau kode salah cuy!')
    }
  }

  const activeBills = bills.filter(b => b.status === 'splitting')
  const totalUnpaid = activeBills.reduce((sum, bill) => sum + bill.amount, 0)

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <div className="relative flex justify-center items-center px-6 pt-14 pb-3">
        <span className="text-[30px] font-serif font-bold tracking-tight">SmartBill</span>
        <div className="absolute right-6 w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold shadow-md cursor-pointer" onClick={() => {
          if (confirm('Mau logout cuy?')) authService.logout()
        }}>
          {userInitials}
        </div>
      </div>

      {/* Hero Card */}
      <div className="mx-4 bg-[#1a5336] rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-emerald-900/20">
        <p className="text-[11px] font-medium opacity-70 uppercase tracking-wide mb-1">
          Total yang belum dibayar
        </p>
        <p className="font-serif text-4xl font-bold tracking-tight mb-4">
          Rp <span className="font-mono">{totalUnpaid.toLocaleString('id-ID')}</span>
        </p>
        <div className="flex gap-3">
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <p className="text-[10px] opacity-65 uppercase tracking-wide mb-1">Kamu bayar</p>
            <p className="font-mono font-medium text-base">
              Rp {myDebt > 0 ? (myDebt / 1000).toLocaleString('id-ID') + 'k' : '0'}
            </p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <p className="text-[10px] opacity-65 uppercase tracking-wide mb-1">Tagihan aktif</p>
            <p className="font-mono font-medium text-base">{activeBills.length} tagihan</p>
          </div>
        </div>
      </div>

      {/* Section Gabung Room */}
      <div className="px-4 mt-6">
        {isJoining ? (
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 border border-emerald-700/30 rounded-2xl shadow-inner animate-fade-in">
            <input
              autoFocus
              type="text"
              placeholder="Ketik 6 digit kode..."
              maxLength={6}
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              className="flex-1 bg-transparent px-3 py-2 text-sm font-bold font-mono outline-none text-dark placeholder-gray-400 uppercase tracking-widest"
            />
            <button
              onClick={async () => {
                if (roomCodeInput.trim().length >= 5) {
                  const code = roomCodeInput.trim().toUpperCase()

                  // 1. Gabung dulu ke Database Go secara resmi
                  const isSuccess = await joinRoomSelf(code)

                  if (isSuccess) {
                    // 2. Refresh daftar riwayat di background biar tagihannya muncul di "Terbaru"
                    loadBills()

                    // 3. Tarik data lengkapnya dan buka Sheet Modal!
                    handleOpenBill(code)

                    setIsJoining(false)
                    setRoomCodeInput('')
                  }
                }
              }}
              className="bg-[#1a5336] text-white px-5 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform shadow-md"
            >
              Masuk
            </button>
            <button
              onClick={() => { setIsJoining(false); setRoomCodeInput('') }}
              className="px-3 text-gray-400 hover:text-red-500 font-bold text-lg"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsJoining(true)}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-semibold text-sm hover:bg-gray-50 hover:border-[#1a5336]/40 hover:text-[#1a5336] transition-all active:scale-[0.98]"
          >
            <span className="text-lg">🔗</span> Gabung Tagihan Teman
          </button>
        )}
      </div>

      {/* Tagihan Terbaru */}
      <div className="px-4 mt-5 pb-28">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[15px] font-semibold text-gray-800">Tagihan Terbaru</h2>
          <span className="text-sm text-emerald-700 font-medium cursor-pointer">Lihat semua →</span>
        </div>

        <div className="flex flex-col gap-2">
          {isLoading ? (
            // Skeleton Loading UI biar keliatan pro
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-gray-100 rounded-2xl w-full"></div>
              <div className="h-20 bg-gray-100 rounded-2xl w-full"></div>
            </div>
          ) : bills.length > 0 ? (
            bills.map((b) => (
              <BillCard
                key={b.id}
                bill={b}
                onClick={() => handleOpenBill(b.roomCode)}
              />
            ))
          ) : (
            <p className="text-center text-sm text-gray-400 mt-4">Belum ada tagihan nih cuy.</p>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 flex items-center justify-around px-8 pt-3 pb-6">
        <button className="flex flex-col items-center gap-1 text-xs font-medium text-emerald-700">
          <span className="text-xl">🏠</span>
          Home
        </button>
        <button
          onClick={onScan}
          className="w-14 h-14 bg-[#1a5336] rounded-2xl flex items-center justify-center text-white text-3xl -mt-4 shadow-lg shadow-emerald-900/40 active:scale-95 transition-transform"
        >
          +
        </button>
        <button className="flex flex-col items-center gap-1 text-xs font-medium text-gray-400">
          <span className="text-xl">🕐</span>
          Riwayat
        </button>
      </div>

      {/* Sheet Modal */}
      <BillDetailSheet
        bill={selectedBill}
        onClose={() => { setSelectedBill(null); loadBills() }}
      />
    </div>
  )
}