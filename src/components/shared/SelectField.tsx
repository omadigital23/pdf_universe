"use client";

/**
 * SelectField.tsx
 * Champ de sélection typé et accessible.
 */

type Props<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  id?: string;
};

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  id,
}: Props<T>) {
  return (
    <label
      className="grid gap-2 text-sm font-medium text-[var(--foreground)]"
      htmlFor={id}
    >
      {label}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-11 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-sm font-medium text-[var(--foreground)] outline-none shadow-[var(--shadow-inset)] transition hover:border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
