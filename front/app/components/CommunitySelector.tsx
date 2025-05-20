"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { COMMUNAUTES, colorMap } from "../types/Communaute";

interface CommunitySelectorProps {
  onSelect: (comm: string) => void;
}

export default function CommunitySelector({
  onSelect,
}: CommunitySelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);

  // pour gérer la transition de sortie
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingSelect, setPendingSelect] = useState<string | null>(null);

  const TRANSITION_DURATION = 500; // correspond à duration-500 en Tailwind

  // met à jour les valeurs de scroll et dimensions
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setScrollX(el.scrollLeft);
    setContainerWidth(el.clientWidth);
    setScrollWidth(el.scrollWidth);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [handleScroll]);

  // appelle onSelect après la fin de la transition
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (pendingSelect) {
      timeout = setTimeout(() => {
        onSelect(pendingSelect);
        setIsTransitioning(false);
        setPendingSelect(null);
      }, TRANSITION_DURATION);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [pendingSelect, onSelect]);

  // paramètres 3D
  const maxItemDepth = 80;
  const maxGroupDepth = 40;
  const maxScroll = Math.max(0, scrollWidth - containerWidth);
  const normPos = maxScroll > 0 ? Math.abs((scrollX / maxScroll) * 2 - 1) : 0;
  const groupDepth = normPos * maxGroupDepth;

  return (
    <div
      className={`relative w-full h-full transition-all duration-500 ease-out ${
        isTransitioning
          ? "opacity-0 scale-95 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-x-auto overflow-y-hidden cursor-grab"
        onScroll={handleScroll}
        style={{ userSelect: "none", transformStyle: "preserve-3d" }}
      >
        <div
          className="flex space-x-6 p-4 items-center"
          style={{
            transform: `translateZ(${groupDepth}px)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.2s ease-out",
            transformOrigin: "center center",
          }}
        >
          {COMMUNAUTES.map((comm, index) => {
            const SLOT_WIDTH = 124;
            const itemCenter = index * SLOT_WIDTH + SLOT_WIDTH / 2;
            const viewCenter = scrollX + containerWidth / 2;
            const offsetNorm = (itemCenter - viewCenter) / (containerWidth / 2);
            const clamped = Math.max(-1, Math.min(1, offsetNorm));
            const itemDepth = Math.abs(clamped) * maxItemDepth;
            const colors = colorMap[comm as keyof typeof colorMap];

            return (
              <button
                key={comm}
                className={`flex-shrink-0 w-108 h-60 flex items-center justify-center rounded-md border-2 ${colors.border} ${colors.bg} ${colors.text} focus:outline-none transition-all duration-500 ease-in-out cursor-pointer hover:scale-105 hover:shadow-lg hover:z-10`}
                onClick={() => {
                  if (isTransitioning) return;
                  setPendingSelect(comm);
                  setIsTransitioning(true);
                }}
                style={{
                  transform: `translateZ(${itemDepth}px)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.2s ease-out",
                  transformOrigin: "center center",
                }}
              >
                <span className="text-center text-5xl px-1">{comm}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
