import { Home as HomeIcon, History } from 'lucide-react'

export type ScreenType = 'home' | 'scan' | 'recap' | 'guest'

interface Props {
    activeScreen: ScreenType
    onNavigate: (screen: ScreenType) => void
}

export default function BottomNav({ activeScreen, onNavigate }: Props) {
    if (activeScreen === 'scan') return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center justify-around px-8 pt-3 pb-6 z-40">
            {/* Tombol Home */}
            <button
                onClick={() => onNavigate('home')}
                className={`w-20 flex flex-col items-center gap-1 text-xs transition-all ${activeScreen === 'home' ? 'text-[#1a5336] font-bold' : 'text-gray-400 font-medium'
                    }`}
            >
                <HomeIcon size={22} strokeWidth={activeScreen === 'home' ? 2.5 : 1.8} />
                Home
            </button>

            {/* Tombol Scan */}
            <button
                onClick={() => onNavigate('scan')}
                className="flex flex-col items-center -mt-4 group"
            >
                <div
                    className="w-14 h-14 bg-[#1a5336] rounded-2xl flex items-center justify-center active:scale-95 transition-transform group-hover:bg-emerald-800"
                    style={{ boxShadow: '0 0 0 4px white, 0 0 16px 4px rgba(26,83,54,0.3)' }}
                >
                    <span className="text-white text-3xl font-light leading-none">+</span>
                </div>
                <span className="text-xs font-bold text-[#1a5336] mt-1">Scan</span>
            </button>

            {/* Tombol Riwayat */}
            <button
                onClick={() => onNavigate('recap')}
                className={`w-20 flex flex-col items-center gap-1 text-xs transition-all ${activeScreen === 'recap' ? 'text-[#1a5336] font-bold' : 'text-gray-400 font-medium'
                    }`}
            >
                <History size={22} strokeWidth={activeScreen === 'recap' ? 2.5 : 1.8} />
                Riwayat
            </button>
        </div>
    )
}