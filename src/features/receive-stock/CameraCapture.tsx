import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

export interface CameraCaptureProps {
  onClose: () => void;
  onCapture: (photo: string) => void;
}

export function CameraCapture({ onClose, onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera access is not available in this webview.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
            setReady(true);
          };
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not open camera. Please grant system permissions.",
        );
      }
    }
    start();
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  function capture() {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const data = canvas.toDataURL("image/jpeg", 0.85);
    onCapture(data);
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Take Photo</div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
          />
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs text-rose-300">
              {error}
            </div>
          )}
          {!error && !ready && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
              Requesting camera permission...
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={capture}
            disabled={!ready}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Camera size={14} /> Capture
          </button>
        </div>
      </div>
    </div>
  );
}
