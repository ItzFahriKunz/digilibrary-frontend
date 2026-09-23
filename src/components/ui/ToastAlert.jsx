import { useState, useEffect, useCallback } from "react";

/**
 * ToastAlert — Komponen toast notifikasi yang muncul di pojok kanan atas.
 *
 * Props:
 * - type: "success" | "error" | "info" (default: "info")
 * - message: string (jika kosong, toast tidak tampil)
 * - duration: number (ms, default 4000)
 * - onDismiss: () => void — dipanggil saat toast hilang
 */
export default function ToastAlert({ type = "info", message, duration = 4000, onDismiss }) {
  const [prevMessage, setPrevMessage] = useState(message);
  const [visible, setVisible] = useState(Boolean(message));
  const [exiting, setExiting] = useState(false);

  if (message !== prevMessage) {
    setPrevMessage(message);
    setVisible(Boolean(message));
    setExiting(false);
  }

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      onDismiss?.();
    }, 300);
  }, [onDismiss]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, dismiss]);

  if (!visible || !message) return null;

  // Style configs per type
  const config = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-800",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
      ),
      progressBar: "bg-emerald-400",
    },
    error: {
      bg: "bg-rose-50",
      border: "border-rose-300",
      text: "text-rose-800",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      progressBar: "bg-rose-400",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-800",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      progressBar: "bg-blue-400",
    },
  };

  const c = config[type] || config.info;

  return (
    <div
      className="fixed top-5 right-5 z-9999 max-w-sm w-full pointer-events-auto"
      style={{
        animation: exiting
          ? "toast-slide-out 0.3s ease-in forwards"
          : "toast-slide-in 0.35s ease-out forwards",
      }}
    >
      <div
        className={`${c.bg} ${c.border} border rounded-2xl shadow-xl overflow-hidden`}
      >
        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <div className={`${c.iconBg} p-2 rounded-xl shrink-0`}>
            <svg className={`w-5 h-5 ${c.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {c.icon}
            </svg>
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className={`text-sm font-semibold ${c.text} leading-snug`}>{message}</p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={dismiss}
            className={`p-1 rounded-lg hover:bg-black/5 ${c.text} opacity-60 hover:opacity-100 transition-opacity cursor-pointer shrink-0`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-black/5">
          <div
            className={`h-full ${c.progressBar} rounded-full`}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      {/* Keyframe animations injected inline */}
      <style>{`
        @keyframes toast-slide-in {
          0% { opacity: 0; transform: translateX(100%) scale(0.95); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toast-slide-out {
          0% { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(100%) scale(0.95); }
        }
        @keyframes toast-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  );
}
