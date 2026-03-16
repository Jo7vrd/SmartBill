import { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { X, Zap, Image as ImageIcon } from 'lucide-react';

export default function CameraScanner({ onNavigate, onCapture }: { onNavigate: (screen: 'home') => void, onCapture: (img: string) => void }) {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white relative overflow-hidden">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />

      <div className="relative z-10 flex flex-col h-full bg-black/20">
        <div className="flex justify-between items-center p-6 pt-12">
          <button onClick={() => onNavigate('home')} className="bg-black/40 backdrop-blur-md p-3 rounded-full active:scale-90 transition-all">
            <X size={20} />
          </button>
          <button className="bg-black/40 backdrop-blur-md text-yellow-400 p-3 rounded-full active:scale-90 transition-all">
            <Zap size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Efek kotak scanner yang lebih futuristik */}
          <div className="relative w-full aspect-[3/4] max-w-sm flex items-center justify-center">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-2xl"></div>
            
            <div className="w-full h-[2px] bg-blue-500/50 absolute top-1/2 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          </div>
          <p className="mt-8 text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Posisikan struk di dalam kotak</p>
        </div>

        <div className="pb-12 pt-6 px-10 flex justify-between items-center">
          <button className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
            <ImageIcon size={20} />
          </button>
          <button 
            onClick={capture}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center p-1 active:scale-90 transition-all"
          >
            <div className="w-full h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"></div>
          </button>
          <div className="w-12 h-12"></div>
        </div>
      </div>
    </div>
  );
}