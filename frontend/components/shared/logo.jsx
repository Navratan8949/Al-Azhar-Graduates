"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteBranding } from "@/hooks/useSiteBranding";
import { useLanguage } from "@/context/LanguageContext";

export function Logo({ variant = "dark", showText = true, className = "" }) {
  const { siteName, shortName, logo } = useSiteBranding();
  let langContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    langContext = useLanguage();
  } catch (e) {}

  const currentOrgName = langContext?.t?.("org.name", shortName) || shortName;

  const textColor =
    variant === "light" ? "text-navy-foreground" : "text-foreground";
  const subColor =
    variant === "light" ? "text-navy-foreground/70" : "text-muted-foreground";

  // Split name for visual balance
  const words = currentOrgName.split(" ");
  const topText = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const bottomText = words.slice(Math.ceil(words.length / 2)).join(" ");

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 sm:gap-3 shrink-0 ${className}`}
      aria-label={`${currentOrgName} home`}
    >
      <Image
        src={logo || "/placeholder.svg"}
        alt={`${currentOrgName} logo`}
        width={400}
        height={400}
        className="size-12 sm:size-16 shrink-0 object-contain"
        priority
      />
      {showText && (
        <span className="flex flex-col leading-tight min-w-0 max-w-[220px] sm:max-w-[280px]">
          <span
            className={`font-serif text-[10px] sm:text-[13px] font-bold tracking-tight ${textColor} truncate uppercase`}
          >
            {topText}
          </span>
          <span
            className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-[0.12em] ${subColor} truncate`}
          >
            {bottomText}
          </span>
        </span>
      )}
    </Link>
  );
}
