import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const customers = [
  { name: "Jane Cooper", email: "jane@email.com", phone: "+1 555 0101", city: "Downtown", bookings: 12, status: "Active" },
  { name: "Hina Ali", email: "hina@email.com", phone: "+1 555 0102", city: "Westside", bookings: 8, status: "Active" },
  { name: "Bilal Raza", email: "bilal@email.com", phone: "+1 555 0103", city: "Northside", bookings: 5, status: "Active" },
  { name: "Ayesha K.", email: "ayesha@email.com", phone: "+1 555 0104", city: "Eastside", bookings: 3, status: "Inactive" },
  { name: "Wade Warren", email: "wade@email.com", phone: "+1 555 0105", city: "Downtown", bookings: 22, status: "Active" },
];

const AdminCustomers = () => (
  <DashboardShell variant="admin" title="Customers" subtitle="View and manage all customers.">
    <div className="rounded-2xl border bg-card shadow-soft">
      <div className="flex items-center gap-3 border-b p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3"><Search className="h-4 w-4 text-muted-foreground" /><Input placeholder="Search customers..." className="border-0 shadow-none focus-visible:ring-0" /></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Customer</th><th>Email</th><th>Phone</th><th>City</th><th>Bookings</th><th>Status</th><th className="text-right pr-4">Actions</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.email} className="border-t">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full gradient-hero text-sm font-bold text-primary-foreground">{c.name.split(" ").map(x=>x[0]).join("")}</div><div className="font-medium">{c.name}</div></div></td>
                <td className="text-muted-foreground">{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.city}</td>
                <td className="font-semibold">{c.bookings}</td>
                <td><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === "Active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{c.status}</span></td>
                <td className="pr-4 text-right"><Button size="sm" variant="outline">View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardShell>
);

export default AdminCustomers;
