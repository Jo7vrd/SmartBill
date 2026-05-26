import { useRef, useCallback, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { X, Zap, Image as ImageIcon } from 'lucide-react'

interface Props {
    onBack: () => void
    onCapture: (img: string) => void
}

export default function ScanStruk({ onBack, onCapture }: Props) {
    const webcamRef = useRef<Webcam>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [flashOn, setFlashOn] = useState(false)
    
    const [aspectRatio, setAspectRatio] = useState<number>(16 / 9)

    useEffect(() => {
        const calculateRatio = () => {
            if (typeof window !== 'undefined') {
                const height = window.innerHeight
                const width = window.innerWidth
                setAspectRatio(height / width)
            }
        }
        
        calculateRatio()
        window.addEventListener('resize', calculateRatio)
        return () => window.removeEventListener('resize', calculateRatio)
    }, [])

    useEffect(() => {
        const toggleTorch = async () => {
            if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
                const stream = webcamRef.current.video.srcObject as MediaStream
                const track = stream.getVideoTracks()[0]

                if (track) {
                    try {
                        const capabilities = track.getCapabilities() as any
                        if (capabilities.torch) {
                            await track.applyConstraints({
                                advanced: [{ torch: flashOn }]
                            } as any)
                        } else if (flashOn) {
                            alert("Yah, Flash nggak didukung di kamera ini cuy.")
                            setFlashOn(false)
                        }
                    } catch (err) {
                        console.error("Gagal nyalain flash:", err)
                    }
                }
            }
        }

        toggleTorch()
    }, [flashOn])

    const processAndStandardizeImage = (dataUrl: string) => {
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            
            // Set resolusi maksimal (1280px udah sangat cukup dan tajam buat OCR)
            const MAX_SIZE = 1280 
            let width = img.width
            let height = img.height

            // Logika Resize proporsional
            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width
                    width = MAX_SIZE
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height
                    height = MAX_SIZE
                }
            }

            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            
            // Gambar ulang ke canvas dengan ukuran baru
            ctx?.drawImage(img, 0, 0, width, height)
            
            // Export jadi JPEG dengan kualitas 85% (Optimal buat AI & enteng buat Backend)
            const standardizedBase64 = canvas.toDataURL('image/jpeg', 0.85)
            
            // Kirim ke backend
            onCapture(standardizedBase64)
        }
        img.src = dataUrl
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                // Jangan langsung onCapture, normalisasi dulu
                processAndStandardizeImage(base64String) 
            }
            reader.readAsDataURL(file)
        }
    }

    const capture = useCallback(() => {
        // Ambil screenshot langsung dari komponen
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            // Normalisasi ukurannya biar sama persis kayak perlakuan galeri
            processAndStandardizeImage(imageSrc)
        }
    }, [onCapture])

    return (
        <div className="flex flex-col h-dvh bg-dark text-white relative overflow-hidden">

            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                // 🌟 Paksa ambil screenshot dari resolusi asli kamera, bukan resolusi layar HP
                forceScreenshotSourceSize={true} 
                videoConstraints={{ 
                    facingMode: 'environment',
                    aspectRatio: aspectRatio,
                    // Minta browser ngakses kamera dengan resolusi tinggi (HD)
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {/* Overlay */}
            <div className="relative z-10 flex flex-col h-full">
                <div className="pt-14" />

                <div className="flex justify-between items-center px-6 pb-4">
                    <button onClick={onBack} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium active:scale-95 transition-transform">
                        <X size={14} /> Batal
                    </button>
                    <button onClick={() => setFlashOn(!flashOn)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium active:scale-95 transition-transform ${flashOn ? 'bg-amber-400 text-dark' : 'bg-white/10 text-white'}`}>
                        <Zap size={14} className={flashOn ? 'fill-dark' : ''} /> Flash
                    </button>
                </div>

                <div className="text-center mt-4 mb-8">
                    <h1 className="font-sans text-2xl font-bold">Scan Struk</h1>
                    <p className="text-sm text-white/50 mt-1 font-sans">Arahkan kamera ke struk belanja</p>
                </div>

                <div className="flex-1 flex items-center justify-center px-10">
                    <div className="relative w-full aspect-3/4">
                        <span className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-accent rounded-tl-sm" />
                        <span className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-accent rounded-tr-sm" />
                        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-accent rounded-bl-sm" />
                        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-accent rounded-br-sm" />
                        <span className="absolute left-0 right-0 h-0.5 bg-accent/60 animate-scan" />
                    </div>
                </div>

                <p className="text-center text-sm text-white/40 font-sans mt-6">
                    Pastikan seluruh struk terlihat dalam bingkai
                </p>

                <div className="pb-10 pt-6 px-10 flex justify-between items-center">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

                    <button onClick={() => fileInputRef.current?.click()} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center active:scale-95 transition-transform hover:bg-white/20">
                        <ImageIcon size={20} />
                    </button>

                    <button onClick={capture} className="w-20 h-20 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: 'rgba(255,255,255,0.15)', padding: 4 }}>
                        <div className="w-full h-full bg-white rounded-full" />
                    </button>

                    <div className="w-14 h-14" />
                </div>
            </div>
        </div>
    )
}