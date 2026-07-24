import { LoginForm } from "@/components/LoginForm";
import type { Metadata } from "next";
import * as motion from "framer-motion/client";

export const metadata: Metadata = {
  title: "Admin Login | Visionary",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden dark font-sans">
      {/* Background Gradient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none" 
      />
      
      <div className="z-10 w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
