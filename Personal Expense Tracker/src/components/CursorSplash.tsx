import { useEffect, useRef } from "react";

const CursorSplash = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const splash = document.createElement("div");
      splash.className = "splash animate-splash";
      splash.style.left = `${e.clientX}px`;
      splash.style.top = `${e.clientY}px`;
      splash.style.width = "100px";
      splash.style.height = "100px";
      container.appendChild(splash);

      setTimeout(() => {
        splash.remove();
      }, 500);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" />;
};

export default CursorSplash;