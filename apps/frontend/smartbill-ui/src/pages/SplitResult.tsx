import { Edit2, Share2, ArrowLeft } from 'lucide-react';
import ItemRow from '../components/ItemRow';

export default function SplitResult({ onNavigate }: { onNavigate: (screen: 'home') => void }) {
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 relative">
      <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('home')} className="active:scale-90 transition-transform">
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900">
            Warung Bu Sri <Edit2 size={16} className="text-slate-400" />
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Tap inisial untuk assign</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
        <ItemRow name="Nasi Goreng Spesial" price="25.000" assignees={['L']} />
        <ItemRow name="Ayam Bakar Madu" price="32.000" assignees={['S']} />
        <ItemRow name="Gado-Gado" price="22.000" assignees={['J']} />
        <ItemRow name="Es Teh x3" price="18.000" assignees={['L', 'S', 'J']} />

        <div className="h-px bg-slate-100 my-6"></div>

        <div className="space-y-3 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center">
            <span className="font-medium">Lisa (L)</span><span className="font-bold">Rp 31.000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Syahrul (S)</span><span className="font-bold">Rp 38.000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Jonathan (J)</span><span className="font-bold">Rp 25.000</span>
          </div>
        </div>

        <div className="flex justify-between items-center font-bold text-xl px-2">
          <span className="text-slate-900">Total</span>
          <span className="text-blue-600">Rp 97.000</span>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10">
        <button 
          onClick={() => onNavigate('home')}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-600/20 hover:bg-blue-700"
        >
          <Share2 size={20} /> Bagikan Tagihan
        </button>
      </div>
    </div>
  );
}