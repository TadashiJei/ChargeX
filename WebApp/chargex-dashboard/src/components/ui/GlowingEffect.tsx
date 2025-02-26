'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlowingEffectProps {
  className?: string;
  variant?: 'white' | 'orange' | 'blue';
  blur?: number;
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
}

export function GlowingEffect({
  className,
  variant = 'white',
  blur = 40,
  spread = 100,
  glow = true,
  disabled = false,
}: GlowingEffectProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled]);

  const variantStyles = {
    white: 'bg-white',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
  };

  return (
    <div
      className={cn(
        'pointer-events-none overflow-hidden',
        className
      )}
    >
      {glow && !disabled && (
        <div
          className={cn(
            'absolute -inset-px opacity-0 transition-opacity duration-500',
            variantStyles[variant]
          )}
          style={{
            opacity: opacity * 0.2,
            filter: `blur(${blur}px)`,
            transform: `translate(${position.x / 20}px, ${position.y / 20}px)`,
          }}
        />
      )}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `radial-gradient(circle ${spread}px at ${position.x}px ${position.y}px, ${
            variant === 'white'
              ? 'rgba(255, 255, 255, 0.08)'
              : variant === 'orange'
              ? 'rgba(249, 115, 22, 0.15)'
              : 'rgba(59, 130, 246, 0.15)'
          }, transparent)`,
          opacity: disabled ? 0 : opacity * 0.7,
          transition: 'opacity 0.3s ease',
        }}
      />
      <div
        className="absolute inset-0 z-20"
        style={{
          backgroundImage: `radial-gradient(circle ${spread / 2}px at ${position.x}px ${position.y}px, ${
            variant === 'white'
              ? 'rgba(255, 255, 255, 0.12)'
              : variant === 'orange'
              ? 'rgba(249, 115, 22, 0.25)'
              : 'rgba(59, 130, 246, 0.25)'
          }, transparent)`,
          opacity: disabled ? 0 : opacity * 0.7,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}
