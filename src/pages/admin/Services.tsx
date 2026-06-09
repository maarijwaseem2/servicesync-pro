import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, assetUrl } from "@/lib/api";
import { Check, X, Trash2, Search } from "lucide-react";

import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const statusBadge = (status: string) => {
  if (status === "pending")
    return <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">Pending</span>;
  if (status === "rejected")
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Rejected</span>;
  return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Active</span>;
};

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"all" | "pending">("all");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const { data: remoteCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const { data: remoteServices = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => api.get("/services/admin/all").then((r) => r.data),
  });

  const approve = useMutation({
    mutationFn: (id: string) => api.patch(`/services/${id}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  const reject = useMutation({
    mutationFn: (id: string) => api.patch(`/services/${id}/reject`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  const servicesList = (remoteServices as any[])
    .map((s: any) => ({
      ...s,
      name: s.title,
      img: s.imageUrl ? assetUrl(s.imageUrl) : "/assets/deep-cleaning.jfif",
      categoryName: s.category?.name || "Uncategorized",
    }))
    .filter((s) => {
      if (tab === "pending" && s.status !== "pending") return false;
      if (catFilter && s.category?.id !== catFilter) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

  const pendingCount = (remoteServices as any[]).filter((s: any) => s.status === "pending").length;

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="admin"
      title="Manage services"
      subtitle="Review pending submissions and manage the active service catalog."
    >
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === "all" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
        >
          All services
        </button>
        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === "pending" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
        >
          Pending approval
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      <div className="rounded-2xl border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 min-w-[240px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <select
            title="Filter by category"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {(remoteCategories as any[]).map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {servicesList.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            {tab === "pending" ? "No services pending approval." : "No services found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {servicesList.map((s: any) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border">
                          <img src={s.img} alt={s.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="max-w-[200px] truncate text-xs text-muted-foreground">
                            {s.description || "No description."}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-muted-foreground">
                      {s.provider?.name || "—"}
                    </td>
                    <td className="capitalize">{s.categoryName}</td>
                    <td className="font-semibold">${s.price}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td className="pr-4 text-right">
                      {s.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700"
                            title="Approve"
                            onClick={() => approve.mutate(s.id)}
                            disabled={approve.isPending}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            title="Reject"
                            onClick={() => reject.mutate(s.id)}
                            disabled={reject.isPending}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        title="Delete"
                        onClick={() => remove.mutate(s.id)}
                        disabled={remove.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default AdminServices;
