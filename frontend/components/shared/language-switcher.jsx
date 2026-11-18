"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher({ variant = "dark" }) {
  const { language, setLanguage, supportedLanguages, mounted } = useLanguage();

  const currentLang = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const triggerClassName =
    variant === "light"
      ? "group flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-foreground transition-all hover:bg-secondary focus:outline-none shadow-sm cursor-pointer"
      : "group flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white transition-all hover:bg-white/20 focus:outline-none backdrop-blur-md cursor-pointer";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={triggerClassName} aria-label="Select Language">
        <Globe
          className={`size-3.5 opacity-90 ${
            variant === "light" ? "text-primary" : "text-accent"
          }`}
        />
        <span className="font-medium tracking-wide">{currentLang.nativeName || currentLang.name}</span>
        <ChevronDown className="size-3 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[170px] rounded-xl border border-border/70 bg-white/95 backdrop-blur-md p-1.5 shadow-xl z-[9999]"
      >
        {supportedLanguages.map((item) => {
          const isActive = item.code === language;
          return (
            <DropdownMenuItem
              key={item.code}
              onClick={() => setLanguage(item.code)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-foreground/80 hover:bg-accent/10 hover:text-primary"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{item.flag}</span>
                <span>{item.nativeName}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-mono">
                  ({item.code})
                </span>
              </div>
              {isActive && <Check className="size-3.5 text-primary stroke-[2.5]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Re-export as GoogleTranslate for backward compatibility across existing layouts
export const GoogleTranslate = LanguageSwitcher;
export default LanguageSwitcher;

