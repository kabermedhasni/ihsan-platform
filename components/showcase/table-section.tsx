import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const donations = [
  { id: "DON-001", donor: "Aminata S.", amount: "$250.00", campaign: "Education Fund", status: "Completed", date: "2025-01-15" },
  { id: "DON-002", donor: "Mohamed O.", amount: "$1,000.00", campaign: "Health Clinic", status: "Pending", date: "2025-01-14" },
  { id: "DON-003", donor: "Fatima B.", amount: "$75.00", campaign: "Clean Water", status: "Completed", date: "2025-01-13" },
  { id: "DON-004", donor: "Ousmane D.", amount: "$500.00", campaign: "Education Fund", status: "Failed", date: "2025-01-12" },
  { id: "DON-005", donor: "Khadija M.", amount: "$150.00", campaign: "Food Security", status: "Completed", date: "2025-01-11" },
]

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Completed":
      return <Badge className="bg-primary/15 text-primary border-primary/30">Completed</Badge>
    case "Pending":
      return <Badge variant="secondary">Pending</Badge>
    case "Failed":
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function TableSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Data Table</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Structured data display with sortable headers and status indicators.
      </p>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Donor</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Campaign</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell className="font-mono text-xs">{donation.id}</TableCell>
                <TableCell className="font-medium">{donation.donor}</TableCell>
                <TableCell>{donation.amount}</TableCell>
                <TableCell className="text-muted-foreground">{donation.campaign}</TableCell>
                <TableCell><StatusBadge status={donation.status} /></TableCell>
                <TableCell className="text-right text-muted-foreground">{donation.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
