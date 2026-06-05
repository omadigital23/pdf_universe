"use client";

/**
 * NumberField.tsx
 * Champ numérique accessible avec label et contraintes min/max/step.
 */

type Props = {
  label: string;
  value: number;
  min: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: Props) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-sm font-medium text-[var(--foreground)] outline-none shadow-[var(--shadow-inset)] transition hover:border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
      />
    </label>
  );
}
