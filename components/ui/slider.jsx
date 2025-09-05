import React from "react";
export function Slider({ value = [0], min = 0, max = 100, step = 1, onValueChange = () => {}, className = "" }) {
  const v = Array.isArray(value) ? value[0] : value ?? 0;
  return (
    <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => {
            const val = Number(e.target.value);
            e.target.style.setProperty("--value", `${(val / max) * 100}%`);
            onValueChange([val]);
        }}
        className={`w-full appearance-none bg-transparent ${className}`}
    />
  );
}
export default Slider;