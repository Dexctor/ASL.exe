"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  href?: string;
  className?: string;
  children: ReactNode;
} & ComponentProps<"button">;

export default function NeonButton({
  href,
  className,
  children,
  disabled,
  ...rest
}: Props) {
  const base =
    "group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neon-cyan/60 bg-midnight/70 px-4 py-3 text-sm uppercase tracking-[0.3em] text-neon-cyan transition hover:bg-neon-cyan/10 hover:text-white";
  const state = disabled ? "opacity-50 pointer-events-none" : "";
  const classes = `${base} ${state} ${className ?? ""}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
