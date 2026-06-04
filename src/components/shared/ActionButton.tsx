"use client";

import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  icon: LucideIcon;
  variant?: "primary" | "accent";
  className?: string;
};

export function ActionButton({
  children,
  disabled,
  loading,
  onClick,
  icon: Icon,
  variant = "primary",
  className = "",
}: Props) {
  const isDisabled = disabled || loading;
  const base =
    "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-5 text-sm font-bold transition duration-200 ease-out active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2";
  const styles =
    variant === "accent"
      ? `${base} border-[var(--accent)] bg-[var(--accent)] text-[var(--panel)] shadow-[var(--shadow-accent)] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-[var(--accent)]`
      : `${base} border-[var(--foreground)] bg-[var(--foreground)] text-[var(--panel)] shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:bg-[var(--foreground-soft)] focus-visible:outline-[var(--foreground)]`;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      aria-disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`${styles} ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Icon className="h-4 w-4" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
