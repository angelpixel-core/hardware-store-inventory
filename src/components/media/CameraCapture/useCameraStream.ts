import { useEffect, useRef, useState } from "react";

export interface UseCameraStreamOptions {
  idealWidth?: number;
  idealHeight?: number;
  quality?: number;
}

export interface UseCameraStreamReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  ready: boolean;
  error: string | null;
  capturePhoto: () => string | null;
}

export function useCameraStream(
  options: UseCameraStreamOptions = {},
): UseCameraStreamReturn {
  const { idealWidth = 1280, idealHeight = 720, quality = 0.85 } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera access is not available in this webview.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: idealWidth },
            height: { ideal: idealHeight },
          },
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

    void startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [idealWidth, idealHeight]);

  function capturePhoto(): string | null {
    const video = videoRef.current;
    if (!video || !ready) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", quality);
  }

  return {
    videoRef,
    ready,
    error,
    capturePhoto,
  };
}
