import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, Check, Sparkles, AlertCircle, FlipHorizontal } from 'lucide-react';

export default function DocumentCameraModal({ isOpen, onClose, onCapture, documentTitle = "Documento", isPortrait = false }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (traseira) ou 'user' (frontal)
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(true);

  // Inicializa o stream da câmera
  const startCamera = useCallback(async (facing) => {
    setIsLoadingCamera(true);
    setCameraError(null);

    // Para qualquer stream anterior
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsLoadingCamera(false);
    } catch (err) {
      console.warn("Tentando câmera padrão sem constraints específicas:", err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsLoadingCamera(false);
      } catch (fallbackErr) {
        console.error("Erro ao acessar câmera:", fallbackErr);
        setCameraError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
        setIsLoadingCamera(false);
      }
    }
  }, []);

  const fallbackInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCapturedImage(null);
      // Se for foto 3x4, inicia por padrão com câmera frontal se preferir, senão traseira
      const defaultFacing = isPortrait ? 'user' : 'environment';
      setFacingMode(defaultFacing);
      startCamera(defaultFacing);
    } else {
      document.body.style.overflow = '';
      // Para stream ao fechar
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      document.body.style.overflow = '';
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, startCamera, isPortrait]);

  // Alterna entre câmera frontal e traseira
  const toggleFacingMode = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Captura o frame atual do vídeo
  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Se for câmera frontal, espelha se necessário
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);

    if (navigator.vibrate) {
      navigator.vibrate(60);
    }
  };

  // Confirma a foto capturada
  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  // Descarta foto e volta para o viewfinder
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleFallbackFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onCapture(event.target.result);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black h-[100dvh] w-screen flex flex-col justify-between text-white animate-fade-in select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent z-30">
        <div className="flex items-center space-x-2">
          <span className="p-2 bg-white/10 rounded-full">
            <Camera className="w-5 h-5 text-indigo-400" />
          </span>
          <div>
            <h3 className="font-semibold text-sm sm:text-base leading-tight">{documentTitle}</h3>
            <p className="text-xs text-slate-400">
              {capturedImage ? "Revise a qualidade da foto" : "Centralize o documento na moldura"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-slate-200"
          aria-label="Fechar câmera"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Viewport & Overlay */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="p-6 text-center max-w-sm mx-4 bg-slate-900/95 rounded-3xl border border-red-500/40 shadow-2xl space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
            <div>
              <h4 className="font-bold text-base text-white">Câmera Direta do Aparelho</h4>
              <p className="text-xs text-slate-300 mt-1">
                {cameraError}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => fallbackInputRef.current?.click()}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Abrir Câmera do Celular</span>
              </button>

              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-all"
              >
                Tentar Scanner Novamente
              </button>
            </div>

            <input
              ref={fallbackInputRef}
              type="file"
              accept="image/*"
              capture={isPortrait ? "user" : "environment"}
              className="hidden"
              onChange={handleFallbackFile}
            />
          </div>
        ) : capturedImage ? (
          /* Preview da Foto Capturada */
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={capturedImage}
              alt="Documento capturado"
              className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl border-2 border-indigo-500/50 object-contain"
            />
            <div className="absolute top-6 px-3 py-1.5 bg-emerald-600/90 backdrop-blur text-white text-xs font-medium rounded-full flex items-center space-x-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Foto capturada! Verifique se está legível</span>
            </div>
          </div>
        ) : (
          /* Live Video Stream com Guia de Centralização */
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            {/* Dimmed backdrop around viewfinder */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Viewfinder / Moldura Centralizadora */}
            <div className={`relative z-10 transition-all duration-300 pointer-events-none ${
              isPortrait
                ? 'w-[75vw] max-w-[290px] aspect-[3/4]'
                : 'w-[90vw] max-w-[460px] aspect-[1.42/1]'
            }`}>
              {/* Highlight corners & Border */}
              <div className={`absolute inset-0 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] border-2 ${
                isPortrait ? 'border-indigo-400/40' : 'border-emerald-400/40'
              }`}>
                {/* Top-Left Corner */}
                <span className={`absolute -top-1.5 -left-1.5 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl ${
                  isPortrait ? 'border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)]' : 'border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                }`} />
                {/* Top-Right Corner */}
                <span className={`absolute -top-1.5 -right-1.5 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl ${
                  isPortrait ? 'border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)]' : 'border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                }`} />
                {/* Bottom-Left Corner */}
                <span className={`absolute -bottom-1.5 -left-1.5 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl ${
                  isPortrait ? 'border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)]' : 'border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                }`} />
                {/* Bottom-Right Corner */}
                <span className={`absolute -bottom-1.5 -right-1.5 w-8 h-8 border-b-4 border-r-4 rounded-br-xl ${
                  isPortrait ? 'border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)]' : 'border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                }`} />

                {/* Se for documento: Laser scanner animation */}
                {!isPortrait && (
                  <div className="scanner-line absolute left-2 right-2 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399]" />
                )}

                {/* Se for Foto 3x4: Guia oval para o rosto */}
                {isPortrait && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-[80%] h-[75%] border-2 border-dashed border-indigo-300/60 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                    </div>
                  </div>
                )}
              </div>

              {/* Central target watermark / helper */}
              <div className="absolute bottom-4 inset-x-0 flex flex-col items-center justify-center text-center px-2">
                <span className="text-[11px] sm:text-xs text-white font-bold bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
                  {isPortrait ? "👤 Posicione seu rosto no centro da moldura" : "📄 Alinhe os 4 cantos do documento"}
                </span>
              </div>
            </div>

            {isLoadingCamera && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20 flex items-center justify-around">
        {capturedImage ? (
          /* Ações pós-captura */
          <div className="flex items-center justify-center space-x-6 w-full max-w-sm">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-medium text-sm transition-all border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tirar Outra</span>
            </button>

            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30"
            >
              <Check className="w-5 h-5" />
              <span>Usar Foto</span>
            </button>
          </div>
        ) : (
          /* Ações durante captura */
          <div className="flex items-center justify-between w-full max-w-xs px-2">
            {/* Trocar Câmera */}
            <button
              onClick={toggleFacingMode}
              className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-slate-200"
              title="Trocar câmera"
              aria-label="Trocar câmera"
            >
              <FlipHorizontal className="w-6 h-6" />
            </button>

            {/* Shutter Button */}
            <button
              onClick={takePhoto}
              disabled={isLoadingCamera || !!cameraError}
              className="relative p-1 rounded-full border-4 border-white/80 active:scale-95 transition-all focus:outline-none disabled:opacity-50"
              aria-label="Capturar foto"
            >
              <div className="w-16 h-16 rounded-full bg-white active:bg-emerald-400 transition-colors shadow-lg" />
            </button>

            {/* Botão de ajuda/espaçador */}
            <div className="w-12 h-12 flex items-center justify-center text-slate-400 text-xs font-mono">
              HD
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
