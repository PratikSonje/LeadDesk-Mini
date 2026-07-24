"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials or too many attempts.");
      } else if (result?.ok) {
        toast.success("Successfully logged in.");
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm mx-auto p-[1px] rounded-2xl bg-gradient-to-b from-white/20 to-white/0 shadow-2xl relative group"
    >
      <div className="absolute inset-0 bg-white/5 blur-xl rounded-2xl group-hover:bg-white/10 transition-colors duration-700" />
      
      <div className="relative p-8 rounded-2xl bg-zinc-950/80 backdrop-blur-3xl border border-white/5 flex flex-col space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-zinc-400 text-sm">Sign in to manage your digital experiences.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Email</Label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.com" 
              className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:border-white/40 text-white placeholder:text-white/30 h-12 rounded-xl transition-all shadow-inner text-base" 
              disabled={isPending} 
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Password</Label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:border-white/40 text-white placeholder:text-white/30 h-12 rounded-xl transition-all shadow-inner text-base" 
              disabled={isPending} 
              required
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-400 hover:to-orange-300 transition-all font-semibold rounded-xl h-12 shadow-[0_0_20px_rgba(249,115,22,0.3)] relative overflow-hidden group text-base"
              disabled={isPending}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="relative z-10 flex items-center justify-center">
                {isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...</>
                ) : (
                  "Sign In"
                )}
              </span>
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
