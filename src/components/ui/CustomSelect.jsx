import { useState, useRef, useEffect } from "react";

/**
 * CustomSelect - Dropdown pengganti native <select> dengan estetika modern,
 * animasi smooth, support custom icon/badge, dan klik di luar untuk menutup.
 *
 * Props:
 * - value: string | number
 * - onChange: (newVal: string | number) => void
 * - options: Array<{ value: string | number, label: string, icon?: React.ReactNode, count?: number | string }>
 * - placeholder?: string
 * - className?: string
 * - buttonClassName?: string
 * - menuClassName?: string
 * - align?: "left" | "right"
 */
export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Pilih opsi...",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  align = "left",
  disabled = false,
  fullWidthMenu = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Cari item yang sedang terpilih
  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative text-left ${className.includes("w-full") ? "w-full" : "inline-block"} ${className}`}>
      {/* Tombol Pemicu (Trigger Button) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full inline-flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] hover:bg-[#F2F7F4] border text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400"
            : isOpen
            ? "border-[#39BF81] ring-2 ring-[#39BF81]/15 text-[#1A1A1A] bg-white"
            : "border-[#D8E6DE] hover:border-[#39BF81]/60 text-[#1A1A1A]"
        } ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate flex items-center gap-1.5 text-left">
          {selectedOption?.icon && (
            <span className="shrink-0 text-[#39BF81]">{selectedOption.icon}</span>
          )}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>

        {/* Chevron Icon dengan animasi rotasi */}
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-[#5C6B64] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#39BF81]" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu Dropdown Popup */}
      {isOpen && !disabled && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-1.5 ${
            fullWidthMenu ? "w-full min-w-full" : "min-w-[170px] w-max max-w-[320px]"
          } bg-white border border-[#D8E6DE] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
          role="listbox"
        >
          <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
            {options.map((opt, idx) => {
              if (opt.isGroupHeader) {
                return (
                  <div
                    key={`group-${idx}`}
                    className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5C6B64] bg-[#F8FAF9] rounded-lg mt-1.5 mb-1"
                  >
                    {opt.label}
                  </div>
                );
              }

              const isSelected = String(opt.value) === String(value);

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#E7F3EC] text-[#2BA76E] font-bold"
                      : "text-[#1A1A1A] hover:bg-[#F8FAF9] hover:text-[#39BF81]"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="truncate flex items-center gap-2">
                    {opt.icon && (
                      <span className={`shrink-0 ${isSelected ? "text-[#2BA76E]" : "text-[#5C6B64]"}`}>
                        {opt.icon}
                      </span>
                    )}
                    <span>{opt.label}</span>
                  </span>

                  {/* Icon Checkmark untuk item terpilih */}
                  {isSelected && (
                    <svg
                      className="w-4 h-4 shrink-0 text-[#2BA76E]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
