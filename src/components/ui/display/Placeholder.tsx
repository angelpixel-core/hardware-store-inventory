import { BarChart3 } from "lucide-react";

export interface PlaceholderProps {
  title?: string;
  description?: string;
}

export function Placeholder({
  title = "Sección en desarrollo",
  description = "Esta sección estará disponible en la próxima iteración del sistema.",
}: PlaceholderProps) {
  return (
    <div className="mx-auto flex max-w-[900px] items-center justify-center py-28">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
          <BarChart3 size={22} />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
