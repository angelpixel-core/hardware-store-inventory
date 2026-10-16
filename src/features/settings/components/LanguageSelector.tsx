import { Check, Globe } from "lucide-react";
import { useTranslation, type Locale } from "../../../i18n";

export function LanguageSelector() {
  const { locale, setLocale, t } = useTranslation();

  const options: { id: Locale; name: string; nativeName: string; desc: string }[] = [
    {
      id: "es",
      name: t.settings.language.spanish,
      nativeName: "Español",
      desc: t.settings.language.spanishDesc,
    },
    {
      id: "en",
      name: t.settings.language.english,
      nativeName: "English",
      desc: t.settings.language.englishDesc,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
          <Globe size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            {t.settings.language.title}
          </h2>
          <p className="text-xs text-slate-500">
            {t.settings.language.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const isSelected = locale === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setLocale(opt.id)}
              className={`group flex items-start justify-between rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-slate-900 bg-slate-900/5 ring-1 ring-slate-900"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    {opt.nativeName}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                    {opt.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{opt.desc}</p>
              </div>

              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white group-hover:border-slate-400"
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
