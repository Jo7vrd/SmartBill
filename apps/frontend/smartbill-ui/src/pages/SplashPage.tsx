import ScanIcon from '../assets/icons/scan.svg?react'

export default function SplashPage({ onMulai, onMasuk, onGabung }: { onMulai: () => void, onMasuk: () => void, onGabung: () => void }) {
    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-between px-6 py-16 font-sans relative overflow-hidden">

            {/* Background blobs */}
            <div className="absolute w-80 h-80 rounded-full bg-white/5 -top-20 -right-20" />
            <div className="absolute w-64 h-64 rounded-full bg-white/5 bottom-40 -left-20" />
            <div className="absolute w-48 h-48 rounded-full bg-white/5 bottom-10 right-10" />

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center z-10">

            <div className="mb-8 relative">
                <h2 className="font-serif text-6xl text-white mb-1">SmartBill</h2>
            </div>

                {/* Icon */}
                <div className="mb-8 relative">
                    {/* <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center"> */}
                        <ScanIcon width={72} height={72} className="text-white/20" />
                    {/* </div> */}
                </div>

                {/* Title */}
                <h2 className="font-sans text-4xl font-bold text-white mb-1">Smart</h2>
                <p className="text-white/40 text-xs font-semibold tracking-[0.1em] uppercase mb-6">Split Bill</p>

                {/* Tagline */}
                <p className="text-white/60 text-base leading-relaxed">
                    Scan struk. Split tagihan.<br />
                    Selesai dalam hitungan detik.
                </p>
            </div>

{/* Bottom buttons */}
<div className="w-full space-y-3 z-10">
    <button
        onClick={onMulai}
        className="w-full bg-accent text-white font-bold py-4 rounded-2xl text-base active:scale-[0.98] transition-transform"
    >
        Mulai Sekarang
    </button>
    <button
        onClick={onMasuk}
        className="w-full bg-white/10 text-white font-medium py-4 rounded-2xl text-base active:scale-[0.98] transition-transform border border-white/15"
    >
        Masuk ke Akun
    </button>
    <button
        onClick={onGabung}
        className="w-full text-white/40 font-medium py-2 text-sm active:scale-[0.98] transition-transform"
    >
        Gabung tagihan doang →
    </button>
</div>

        </div>
    )
}