import { TableHead } from "@/components/ui/table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { SortDirection } from "@/hooks/use-sort";

interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  className?: string;
}

const SortableHeader = ({ label, active, direction, onClick, className }: SortableHeaderProps) => (
  <TableHead
    className={`text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors ${className ?? ""}`}
    onClick={onClick}
  >
    <span className="inline-flex items-center gap-1">
      {label}
      {active && direction === "asc" ? (
        <ArrowUp className="w-3 h-3" />
      ) : active && direction === "desc" ? (
        <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-40" />
      )}
    </span>
  </TableHead>
);

export default SortableHeader;
