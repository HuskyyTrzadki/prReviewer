"use client";

import { useEffect, useState } from "react";

const revealOffset = 640;

export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > revealOffset);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      aria-label="Scroll back to top"
      className={`fixed bottom-5 right-5 z-40 inline-flex size-12 items-center justify-center rounded-full border border-silver bg-white text-xl text-navy shadow-float transition-all duration-200 hover:-translate-y-0.5 hover:text-indigo-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/25 focus-visible:ring-offset-2 sm:bottom-6 sm:right-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      onClick={handleClick}
      type="button"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
};
