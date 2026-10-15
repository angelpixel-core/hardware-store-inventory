import { Camera, X } from "lucide-react";
import { useCameraStream } from "./useCameraStream";

export interface CameraCaptureProps {
  onClose: () => void;
  onCapture: (photo: string) => void;
}

export function CameraCapture({ onClose, onCapture }: CameraCaptureProps) {
  const { videoRef, ready, error, capturePhoto } = useCameraStream();

  function handleCapture() {
    const photo = capturePhoto();
    if (photo) {
      onCapture(photo);
    }
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
            onClick={handleCapture}
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
