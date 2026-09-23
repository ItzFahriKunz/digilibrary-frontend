import React from "react";

/**
 * CustomCheckbox - Checkbox modern pengganti native <input type="checkbox">
 * dengan desain elegan berstandar Digilibrary SD, animasi checkmark halus,
 * dan dukungan keyboard accessibility.
 *
 * Props:
 * - checked: boolean
 * - onChange: (checked: boolean) => void
 * - label?: React.ReactNode
 * - description?: string
 * - disabled?: boolean
 * - id?: string
 * - className?: string
 */
export default function CustomCheckbox({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  id,
  className = "",
}) {
  const generatedId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (onChange) onChange(!checked);
    }
  };

  return (
    <label
      htmlFor={generatedId}
      onClick={handleClick}
      className={`inline-flex items-start gap-2.5 cursor-pointer select-none group ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={generatedId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
          className="sr-only"
          tabIndex={-1}
        />
        <div
          role="checkbox"
          aria-checked={checked}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          className={`w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#39BF81]/30 ${
            checked
              ? "bg-[#2BA76E] border-[#2BA76E] text-white shadow-xs"
              : "bg-white border-[#D8E6DE] group-hover:border-[#39BF81] text-transparent"
          } ${disabled ? "bg-slate-100 border-slate-200" : ""}`}
        >
          <svg
            className={`w-3 h-3 transition-transform duration-150 ${
              checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3.2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col text-xs leading-snug">
          {label && (
            <span
              className={`font-semibold transition-colors ${
                checked ? "text-[#1A1A1A]" : "text-[#5C6B64] group-hover:text-[#1A1A1A]"
              }`}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-[#5C6B64] mt-0.5 font-normal">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
