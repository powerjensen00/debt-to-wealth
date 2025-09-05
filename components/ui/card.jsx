export function Card({ className = "", ...props }) {
  return <div className={`rounded-2xl border border-[var(--ed-border)] bg-[var(--ed-card)] shadow-sm ${className}`} {...props} />;
}
export function CardContent({ className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}
export default Card;