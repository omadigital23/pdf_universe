type Props = {
  className?: string;
  size?: number;
};

export function OmaLogo({ className, size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" fill="var(--foreground)" />
      <rect
        x="7"
        y="7"
        width="34"
        height="34"
        rx="9"
        stroke="var(--accent-light)"
        strokeOpacity="0.2"
      />
      <path
        d="M17 12.5H28.4L35 19.1V36H17V12.5Z"
        fill="var(--panel)"
      />
      <path
        d="M28.4 12.5V19.1H35"
        fill="var(--accent-muted)"
        stroke="var(--accent)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 24.5H30.5M21.5 29H28.5"
        stroke="var(--foreground)"
        strokeOpacity="0.5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12.5 27C12.5 20.65 17.65 15.5 24 15.5"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M11.5 22.2L12.45 27.05L17.25 26.05"
        stroke="var(--accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 35.5C18.7 35.5 22.5 33.2 24.4 29.7"
        stroke="var(--accent-light)"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <circle cx="34.5" cy="34.5" r="3.5" fill="var(--accent)" />
    </svg>
  );
}
