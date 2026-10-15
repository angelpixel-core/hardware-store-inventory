import { Camera, ImagePlus, X } from "lucide-react";

export interface PhotoAttachmentProps {
  photo?: string;
  onClearPhoto: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRequestCamera: () => void;
}

export function PhotoAttachment({
  photo,
  onClearPhoto,
  onFileChange,
  onRequestCamera,
}: PhotoAttachmentProps) {
  return (
    <div>
      <span className="mb-1.5 block text-xs text-slate-500">
        Product / Shipment Photo (optional)
      </span>
      {photo ? (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200">
          <img
            src={photo}
            alt="Snapshot"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onClearPhoto}
            className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1 text-white hover:bg-slate-900"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
            <ImagePlus size={16} /> Upload photo
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={onRequestCamera}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Camera size={16} /> Take photo
          </button>
        </div>
      )}
    </div>
  );
}
