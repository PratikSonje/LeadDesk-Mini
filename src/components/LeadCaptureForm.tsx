"use client";

import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { createLeadSchema } from "@/lib/validations";
import { z } from "zod";
import { createLead } from "@/server/actions/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

export function LeadCaptureForm() {
  const [isPending, startTransition] = useTransition();
  const [isCustomBudget, setIsCustomBudget] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<z.infer<typeof createLeadSchema>>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      budget: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof createLeadSchema>) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await createLead(formData);

      if (result?.error) {
        toast.error(
          typeof result.error === "string" 
            ? result.error 
            : "Please check your inputs and try again."
        );
      } else if (result?.success) {
        toast.success("Thank you! Your request has been received.");
        reset();
      }
    });
  }

  return (
    <div className="w-full min-h-full bg-zinc-950 flex flex-col pt-12 pb-6 px-6 relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Let's Connect</h2>
        <p className="text-zinc-400 text-sm">Tell us about your project and we'll get back to you shortly.</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex-1">
        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Name</Label>
          <Input 
            placeholder="Steve Jobs" 
            className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:border-white/40 text-white placeholder:text-white/30 h-12 rounded-xl transition-all shadow-inner text-base" 
            {...register("name")} 
            disabled={isPending} 
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Email</Label>
          <Input 
            type="email" 
            placeholder="steve@apple.com" 
            className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:border-white/40 text-white placeholder:text-white/30 h-12 rounded-xl transition-all shadow-inner text-base" 
            {...register("email")} 
            disabled={isPending} 
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Budget</Label>
          <Controller
            control={control}
            name="budget"
            render={({ field }) => (
              isCustomBudget ? (
                <div className="relative">
                  <Input 
                    type="number"
                    placeholder="e.g. 25000" 
                    className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:border-white/40 text-white placeholder:text-white/30 h-12 rounded-xl transition-all shadow-inner text-base pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    {...field} 
                    disabled={isPending} 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setIsCustomBudget(false);
                      field.onChange("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Select 
                  onValueChange={(val) => {
                    if (val === "custom") {
                      setIsCustomBudget(true);
                      field.onChange("");
                    } else {
                      field.onChange(val);
                    }
                  }} 
                  value={field.value} 
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:border-white/40 text-white h-12 rounded-xl shadow-inner data-[placeholder]:text-white/30 transition-all text-base">
                    <SelectValue placeholder="Select a budget range" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl shadow-2xl blur-0">
                    <SelectItem value="under_5k">Under $5,000</SelectItem>
                    <SelectItem value="5k_to_20k">$5,000 - $20,000</SelectItem>
                    <SelectItem value="20k_plus">$20,000+</SelectItem>
                    <SelectItem value="custom" className="font-semibold text-orange-400 focus:text-orange-300">Custom Amount...</SelectItem>
                  </SelectContent>
                </Select>
              )
            )}
          />
          {errors.budget && <p className="text-xs text-red-400">{errors.budget.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider">Project Details</Label>
          <Textarea 
            placeholder="Tell us about your vision..." 
            className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:border-white/40 text-white placeholder:text-white/30 resize-none h-[120px] overflow-y-auto rounded-xl transition-all shadow-inner text-base" 
            {...register("message")} 
            disabled={isPending}
          />
          {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-400 hover:to-orange-300 transition-all font-semibold rounded-xl h-14 mt-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] relative overflow-hidden group text-lg"
            disabled={isPending}
          >
            {/* Button sweep animation layer */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            <span className="relative z-10 flex items-center justify-center">
              {isPending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                "Submit Inquiry"
              )}
            </span>
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
