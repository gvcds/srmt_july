'use client';

import { cn } from "@/lib/utils";
import { useLanguage, type Language } from "@/components/language-provider";
import type { ChangeEvent } from "react";

const languageOptions: ReadonlyArray<{ value: Language; label: string }> = [
  { value: "pt-BR", label: "PT-BR" },
  { value: "en", label: "EN" },
];

const languageLabel = {
  "pt-BR": "Selecionar idioma",
  en: "Select language",
} as const satisfies Record<Language, string>;

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = event.target.value as Language;

    if (nextLanguage !== language) {
      setLanguage(nextLanguage);
    }
  };

  const label = languageLabel[language];

  return (
    <select
      className={cn(
        "h-10 min-w-[110px] rounded-md border border-input bg-background px-3 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      value={language}
      onChange={handleChange}
      aria-label={label}
      title={label}
    >
      {languageOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

