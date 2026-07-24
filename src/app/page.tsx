import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { MobileMockup } from "@/components/MobileMockup";
import type { Metadata } from "next";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "LeadDesk Mini | Premium Lead Management",
  description: "Capture inbound leads securely and manage them with a beautifully designed admin dashboard.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden dark font-sans selection:bg-orange-500/30">
      
      {/* Top Navigation / Admin Button */}
      <div className="absolute top-0 right-0 p-8 z-50">
        <Link 
          href="/admin" 
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }), 
            "border-white/10 text-white/50 hover:text-white hover:bg-white/5 bg-black/50 rounded-full px-4 md:px-6 transition-all backdrop-blur-md text-xs md:text-sm"
          )}
        >
          Admin Portal
        </Link>
      </div>

      {/* Background Gradient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-900/20 rounded-full blur-[150px] pointer-events-none" 
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-700/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="z-10 w-full max-w-[1400px] mx-auto min-h-screen flex flex-col-reverse lg:flex-row items-center justify-between p-6 lg:p-16 gap-12 lg:gap-16 pt-24 lg:pt-16 pb-24 lg:pb-16">
        
        {/* Left Side: Mobile Mockups */}
        <div className="flex-1 w-full flex items-center justify-center relative h-[700px]">
          
          {/* Background blurred mockup (Left) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:block">
            <MobileMockup blurred scale={0.85} delay={0.4} y={-20} className="opacity-40">
               <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center p-6 text-center opacity-30">
                 <div className="w-16 h-16 rounded-full bg-orange-500/20 mb-4" />
                 <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                 <div className="h-4 w-1/2 bg-white/10 rounded" />
               </div>
            </MobileMockup>
          </div>

          {/* Primary Form Mockup (Center) */}
          <div className="relative z-20 mx-auto">
            <MobileMockup delay={0.2} scale={1} y={0}>
              <LeadCaptureForm />
            </MobileMockup>
          </div>

          {/* Background blurred mockup (Right) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block">
            <MobileMockup blurred scale={0.85} delay={0.6} y={20} className="opacity-40">
               <div className="w-full h-full bg-zinc-900 p-6 space-y-4 opacity-30">
                 <div className="w-full h-32 rounded-xl bg-orange-500/20" />
                 <div className="h-4 w-full bg-white/10 rounded" />
                 <div className="h-4 w-2/3 bg-white/10 rounded" />
               </div>
            </MobileMockup>
          </div>

        </div>
        
        {/* Right Side: Typography & List */}
        <div className="flex-1 w-full max-w-xl flex flex-col justify-center space-y-16">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.1] mb-6">
              LeadDesk <br />
              Mini
            </h1>
            <div className="w-16 h-1 bg-orange-500 rounded-full" />
          </motion.div>

          <motion.div 
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.4 } }
            }}
          >
            {[
              { num: "01", title: "Connect With Us", href: null },
              { num: "02", title: "Admin View", href: "/admin" },
              { num: "03", title: "Secure Connect", href: null },
            ].map((item) => {
              const content = (
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-white text-orange-500 font-bold text-xl flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-lg">
                    {item.num}
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
              );

              return (
                <motion.div 
                  key={item.num}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                >
                  {item.href ? (
                    <Link href={item.href} className="block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-6 w-full text-center z-50 text-sm text-zinc-500">
        <Link 
          href="https://digitalheroesco.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-orange-500 transition-colors"
        >
          Made For Digital Heroes
        </Link>
      </div>
    </main>
  );
}
