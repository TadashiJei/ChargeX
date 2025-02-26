'use client';

import { GlowingEffect } from './ui/GlowingEffect';

export function MetaMaskPrompt() {
  return (
    <div className="space-y-6 p-6 relative rounded-lg bg-gray-800/40 backdrop-blur-sm">
      <GlowingEffect
        blur={20}
        disabled={false}
        glow
        className="absolute inset-0"
        variant="orange"
        spread={60}
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4">
          <img 
            src="/metamask-fox.svg" 
            alt="MetaMask Logo" 
            className="w-16 h-16"
            onError={(e) => {
              e.currentTarget.src = "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg";
            }}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">MetaMask Required</h3>
        <p className="text-gray-300 mb-4">
          To use the blockchain features of ChargeX, you need to install the MetaMask browser extension.
        </p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 10V6" />
            <path d="M12 14v4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span>Install MetaMask</span>
        </a>
      </div>
    </div>
  );
}
