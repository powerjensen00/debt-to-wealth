import React from "react";
export const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-xl border border-[var(--ed-border)] bg-white px-3 py-2 text-sm outline-none
                  focus:ring-4 focus:ring-[color:oklch(0.85_0.12_160/0.35)] focus:border-[var(--ed-primary)] ${className}`}
      {...props}
    />
  );
});
export default Input;