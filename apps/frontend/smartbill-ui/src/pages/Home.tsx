import { Plus } from 'lucide-react';

export default function Home({ onNavigate }: { onNavigate: (screen: 'camera') => void }) {
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 relative">
      {/* Header Premium */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full shadow-sm"></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Selamat datang,</p>
              <p className="font-bold text-slate-900">User</p>
            </div>
          </div>
        </div>
        
        {/* Banner Saldo / Info */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xl shadow-slate-900/20">
          <p className="text-sm text-slate-300 font-medium mb-1">Total Tagihan Aktif</p>
          <h2 className="text-3xl font-bold">Rp 162.000</h2>
        </div>
      </div>

      {/* History List */}
      <div className="px-6 py-6 overflow-y-auto pb-28">
        <h3 className="font-bold text-slate-900 mb-4 text-lg">Riwayat Split</h3>
        
        <div className="space-y-3">
          {/* Card 1 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
              🍜
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900">Warung Bu Sri</h4>
              <p className="text-xs text-slate-500 font-medium">28 Feb 2026 • 3 Orang</p>
            </div>
            <div className="font-bold text-slate-900">Rp 97k</div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xl">
              ☕
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900">Kopi Kenangan</h4>
              <p className="text-xs text-slate-500 font-medium">25 Feb 2026 • 2 Orang</p>
            </div>
            <div className="font-bold text-slate-900">Rp 65k</div>
          </div>
        </div>
      </div>

      {/* Floating Action Button dengan Glassmorphism */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-white/70 backdrop-blur-md p-2 rounded-full shadow-lg pointer-events-auto border border-white/50">
          <button 
            onClick={() => onNavigate('camera')}
            className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-md shadow-blue-600/30 active:scale-90 transition-all hover:bg-blue-700"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}