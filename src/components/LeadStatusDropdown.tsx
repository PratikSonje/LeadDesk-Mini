"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/server/actions/lead";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Props {
  id: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
}

export function LeadStatusDropdown({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  function onValueChange(newStatus: any) {
    if (!newStatus || newStatus === status) return;
    
    startTransition(async () => {
      const result = await updateLeadStatus(id, newStatus as any);
      if (result?.error) {
        toast.error("Failed to update status");
      } else {
        toast.success("Status updated");
      }
    });
  }

  return (
    <Select value={status} onValueChange={onValueChange} disabled={isPending}>
      <SelectTrigger className="w-[140px] h-9 bg-zinc-900 border-white/10 text-xs font-semibold focus:ring-1 focus:ring-orange-500">
        <div className="flex items-center gap-2">
          {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-white/10 text-white">
        <SelectItem value="NEW" className="text-xs font-semibold text-blue-400">NEW</SelectItem>
        <SelectItem value="CONTACTED" className="text-xs font-semibold text-yellow-400">CONTACTED</SelectItem>
        <SelectItem value="CLOSED" className="text-xs font-semibold text-green-400">CLOSED</SelectItem>
      </SelectContent>
    </Select>
  );
}
