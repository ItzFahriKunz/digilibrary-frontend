import { useEffect, useRef, useState } from "react";

/**
 * RevealOnScroll Component
 * Memberikan animasi transisi halus (fade-in & slide) saat elemen masuk ke layar ketika di-scroll ke bawah.
 * 
 * Props:
 *  - children: Elemen React yang dibungkus
 *  - className: Tambahan class Tailwind/CSS
 *  - delay: Waktu jeda sebelum animasi mulai (ms)
 *  - direction: "up" | "down" | "left" | "right" | "zoom" | "none"
 *  - duration: Durasi transisi (ms)
 *  - distance: Jarak perpindahan sebelum masuk viewport (px)
 *  - threshold: Persentase elemen harus terlihat sebelum trigger (0 - 1)
 */
export default function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 650,
  distance = 24,
  threshold = 0.05,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const element = domRef.current;
    if (!element) return;

    // Cek apakah browser mendukung IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    // Cek apakah user mengaktifkan prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px 40px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)";
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      case "zoom":
        return "scale(0.94)";
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
