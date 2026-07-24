import { prisma } from "@/lib/db";
import { LeadStatusDropdown } from "@/components/LeadStatusDropdown";
import { DeleteLeadButton } from "@/components/DeleteLeadButton";
import { AdminSearch } from "@/components/AdminSearch";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Opt out of static rendering so this page always fetches fresh leads
export const dynamic = "force-dynamic";

export default async function AdminDashboard(props: {
  searchParams?: Promise<{ q?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const PAGE_SIZE = 25;

  const whereClause = {
    deleted_at: null,
    ...(query ? {
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { email: { contains: query, mode: "insensitive" as const } }
      ]
    } : {})
  };

  const [leads, totalCount] = await Promise.all([
    prisma.lead.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.lead.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Lead Management</h1>
          <p className="text-zinc-400">View and manage inbound project inquiries.</p>
        </div>
        <AdminSearch />
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-black/40 text-xs uppercase text-zinc-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Prospect</th>
                <th className="px-6 py-4 font-semibold">Budget</th>
                <th className="px-6 py-4 font-semibold">Project Details</th>
                <th className="px-6 py-4 font-semibold">Submitted</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    {query ? (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <p className="text-zinc-400">No matches found for "{query}"</p>
                        <Link href="/admin" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-2")}>
                          Clear Search
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                          <span className="text-xl">📥</span>
                        </div>
                        <p className="text-zinc-400 font-medium">No leads yet</p>
                        <p className="text-zinc-500 text-sm">When visitors submit the form, they will appear here.</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-zinc-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/80 text-xs font-medium border border-white/10">
                        {lead.budget}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-zinc-400" title={lead.message || ""}>
                        {lead.message || <span className="italic text-zinc-600">No details provided</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lead.created_at))}
                    </td>
                    <td className="px-6 py-4">
                      <LeadStatusDropdown id={lead.id} status={lead.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteLeadButton id={lead.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400 px-2 pb-4">
          <div className="text-center sm:text-left">
            Showing <span className="text-white font-medium">{(page - 1) * PAGE_SIZE + 1}</span> to <span className="text-white font-medium">{Math.min(page * PAGE_SIZE, totalCount)}</span> of <span className="text-white font-medium">{totalCount}</span> leads
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <Link 
              href={`/admin?${new URLSearchParams({ ...(query && { q: query }), page: (page - 1).toString() })}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                page <= 1 && "pointer-events-none opacity-50",
                "flex-1 sm:flex-none"
              )}
            >
              Previous
            </Link>
            <Link 
              href={`/admin?${new URLSearchParams({ ...(query && { q: query }), page: (page + 1).toString() })}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                page >= totalPages && "pointer-events-none opacity-50",
                "flex-1 sm:flex-none"
              )}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
