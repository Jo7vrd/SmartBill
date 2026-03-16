import { useState } from 'react';
import Home from './pages/Home';
import CameraScanner from './pages/CameraScanner';
import SplitResult from './pages/SplitResult';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'camera' | 'result'>('home');

  const handleCapture = (base64Image: string) => {
    console.log('Gambar siap dikirim ke API OCR:', base64Image.substring(0, 50) + '...');
    setCurrentScreen('result');
  };

  return (
    <div className="max-w-md mx-auto shadow-2xl overflow-hidden bg-white">
      {currentScreen === 'home' && <Home onNavigate={setCurrentScreen} />}
      {currentScreen === 'camera' && <CameraScanner onNavigate={setCurrentScreen} onCapture={handleCapture} />}
      {currentScreen === 'result' && <SplitResult onNavigate={setCurrentScreen} />}
    </div>
  );
}