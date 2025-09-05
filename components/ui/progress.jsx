export function Progress({ value = 0, className = "" }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full rounded-full bg-black/10 ${className}`}>
      <div className="h-full rounded-full transition-all bg-[var(--ed-primary)]" style={{ width: `${v}%` }} />
    </div>
  );
}
export default Progress;