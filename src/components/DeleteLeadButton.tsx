"use client";

import { useTransition, useState } from "react";
import { softDeleteLead } from "@/server/actions/lead";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import * as motion from "framer-motion/client";

interface Props {
  id: string;
}

export function DeleteLeadButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleConfirm() {
    startTransition(async () => {
      const result = await softDeleteLead(id);
      if (result?.error) {
        toast.error("Failed to delete lead");
      } else {
        toast.success("Lead deleted");
        setShowConfirm(false);
      }
    });
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setShowConfirm(true)} 
        disabled={isPending}
        className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10 w-9 h-9"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden"
          >
            {/* Subtle red glow in the background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Lead?</h3>
              <p className="text-sm text-zinc-400 mb-6">
                This action will move the lead to the trash. You won't be able to see it in the active dashboard anymore.
              </p>
              
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 border-zinc-200 text-black hover:bg-zinc-100"
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
                  onClick={handleConfirm}
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
