export function Label({ className = "", ...props }) {
  return <label className={`block text-sm font-medium text-[var(--ed-ink)]/80 ${className}`} {...props} />;
}
export default Label;