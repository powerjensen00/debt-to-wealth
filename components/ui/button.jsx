export function Button({ as: Tag = "button", variant = "default", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold tracking-tight transition active:scale-[.99] disabled:opacity-50 disabled:pointer-events-none shadow-sm";
  const variants = {
    default: "bg-[var(--ed-primary)] text-white hover:bg-[var(--ed-primary-600)]",
    secondary: "bg-[var(--ed-card)] text-[var(--ed-ink)] border border-[var(--ed-border)] hover:bg-[var(--ed-primary-50)]",
    ghost: "bg-transparent hover:bg-black/[0.04]",
  };
  return <Tag className={`${base} ${variants[variant] ?? variants.default} ${className}`} {...props} />;
}
export default Button;