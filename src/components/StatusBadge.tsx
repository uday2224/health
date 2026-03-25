import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/mock-data";

const statusConfig: Record<string, { bg: string; text: string; dot?: boolean }> = {
  PENDING: { bg: "bg-warning/10", text: "text-warning" },
  CONFIRMED: { bg: "bg-primary/10", text: "text-primary" },
  IN_PROGRESS: { bg: "bg-success/10", text: "text-success", dot: true },
  COMPLETED: { bg: "bg-muted", text: "text-muted-foreground" },
  CANCELLED: { bg: "bg-destructive/10", text: "text-destructive" },
  REVIEWED: { bg: "bg-muted", text: "text-muted-foreground" },
  ACTIVE: { bg: "bg-success/10", text: "text-success" },
  PENDING_VERIFICATION: { bg: "bg-warning/10", text: "text-warning" },
  SUSPENDED: { bg: "bg-destructive/10", text: "text-destructive" },
  Paid: { bg: "bg-success/10", text: "text-success" },
  Refunded: { bg: "bg-warning/10", text: "text-warning" },
  Failed: { bg: "bg-destructive/10", text: "text-destructive" },
  Pending: { bg: "bg-warning/10", text: "text-warning" },
  EXTRACTED: { bg: "bg-primary/10", text: "text-primary" },
  USED: { bg: "bg-muted", text: "text-muted-foreground" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = statusConfig[status] || { bg: "bg-muted", text: "text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-xs font-medium", config.bg, config.text, className)}>
      {config.dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />}
      {status.replace(/_/g, " ")}
    </span>
  );
}
