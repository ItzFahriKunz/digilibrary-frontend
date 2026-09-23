import { useEffect } from "react";

export default function AuthOtpInput({
  otp = ["", "", "", "", "", ""],
  onChange,
  inputRefs,
  autoFocusFirst = true,
  disabled = false,
}) {
  // Auto-focus input pertama saat komponen dimuat
  useEffect(() => {
    if (autoFocusFirst && inputRefs?.current?.[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocusFirst, inputRefs]);

  const handleDigitChange = (index, value) => {
    if (disabled) return;
    const digitsOnly = value.replace(/\D/g, "");
    const newOtp = [...otp];

    if (!digitsOnly) {
      newOtp[index] = "";
      onChange(newOtp);
      return;
    }

    if (digitsOnly.length > 1) {
      const chars = digitsOnly.slice(0, 6).split("");
      chars.forEach((c, i) => {
        if (index + i < 6) newOtp[index + i] = c;
      });
      onChange(newOtp);
      const nextFocus = Math.min(index + chars.length, 5);
      inputRefs?.current?.[nextFocus]?.focus();
      return;
    }

    newOtp[index] = digitsOnly.slice(-1);
    onChange(newOtp);
    if (index < 5 && digitsOnly) {
      inputRefs?.current?.[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (disabled) return;
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs?.current?.[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs?.current?.[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs?.current?.[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    onChange(newOtp);
    const nextFocus = Math.min(pasted.length, 5);
    inputRefs?.current?.[nextFocus]?.focus();
  };

  return (
    <div
      className="flex items-center justify-between gap-2 sm:gap-2.5 py-1"
      onPaste={handlePaste}
    >
      {otp.map((digit, idx) => {
        const isFilled = Boolean(digit);
        return (
          <input
            key={idx}
            ref={(el) => {
              if (inputRefs && inputRefs.current) {
                inputRefs.current[idx] = el;
              }
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`w-11 h-13 sm:w-13 sm:h-14 text-lg sm:text-xl font-mono font-bold text-center rounded-2xl border-2 transition-all duration-200 outline-none select-all cursor-text ${
              isFilled
                ? "border-[#39BF81] bg-[#E7F3EC]/40 text-[#39BF81] shadow-xs"
                : "border-[#D8E6DE] bg-[#F8FAF9] text-[#1A1A1A] hover:border-[#39BF81]/50"
            } focus:border-[#39BF81] focus:bg-white focus:ring-4 focus:ring-[#E7F3EC] focus:scale-105 focus:shadow-md disabled:opacity-50`}
          />
        );
      })}
    </div>
  );
}
