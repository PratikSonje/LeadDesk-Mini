"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MobileMockupProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  scale?: number;
  rotate?: number;
  y?: number;
  blurred?: boolean;
}

export function MobileMockup({ children, className = "", delay = 0, scale = 1, rotate = 0, y = 0, blurred = false }: MobileMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: y + 50, scale: scale * 0.9, rotate }}
      animate={{ opacity: blurred ? 0.6 : 1, y, scale, rotate }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-[375px] h-[750px] shrink-0 bg-black rounded-[50px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden border-[8px] border-zinc-800 ${className}`}
      style={{
        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.9), inset 0 0 0 2px rgba(255, 255, 255, 0.15)",
        filter: blurred ? "blur(4px)" : "none"
      }}
    >
      {/* Top Notch Area */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
        <div className="w-32 h-6 bg-zinc-800 rounded-b-xl flex items-center justify-center gap-2 px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-black/50" />
          <div className="w-12 h-1.5 rounded-full bg-black/50" />
        </div>
      </div>
      
      {/* Side Buttons (Visual Only) */}
      <div className="absolute top-24 -left-[6px] w-[3px] h-10 bg-zinc-700 rounded-l-sm" />
      <div className="absolute top-36 -left-[6px] w-[3px] h-16 bg-zinc-700 rounded-l-sm" />
      <div className="absolute top-36 -right-[6px] w-[3px] h-20 bg-zinc-700 rounded-r-sm" />

      {/* Screen Content Wrapper */}
      <div 
        className="w-full h-full bg-zinc-950 overflow-y-auto overflow-x-hidden pb-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
        `}} />
        {children}
      </div>
    </motion.div>
  );
}
