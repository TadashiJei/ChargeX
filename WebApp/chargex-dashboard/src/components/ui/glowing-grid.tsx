'use client';

import { cn } from "@/lib/utils";

interface GlowingGridProps {
  className?: string;
}

export function GlowingGrid({ className }: GlowingGridProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <div
        className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(55, 65, 81, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(55, 65, 81, 0.1) 1px, transparent 1px)`,
          maskImage: `radial-gradient(white, transparent)`,
          WebkitMaskImage: `radial-gradient(white, transparent)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent" />
    </div>
  );
}
