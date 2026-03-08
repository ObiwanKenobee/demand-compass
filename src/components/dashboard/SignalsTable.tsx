import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { usePagination } from "@/hooks/use-pagination";
import TablePagination from "./TablePagination";

interface Signal {
  id: string;
  title: string;
  signal_type: string;
  description: string | null;
  created_at: string;
}

interface SignalsTableProps {
  signals: Signal[];
  isAdmin: boolean;
  isLive: boolean;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const SignalsTable = ({ signals, isAdmin, isLive, onDelete }: SignalsTableProps) => {
  const { page, setPage, totalPages, paginatedItems, totalItems, startIndex, endIndex } = usePagination(signals, 10);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground">Organization</TableHead>
            <TableHead className="text-muted-foreground">Type</TableHead>
            <TableHead className="text-muted-foreground">Description</TableHead>
            <TableHead className="text-muted-foreground">When</TableHead>
            {isAdmin && isLive && <TableHead className="text-muted-foreground w-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin && isLive ? 5 : 4} className="text-center text-muted-foreground py-8">
                No signals match your search
              </TableCell>
            </TableRow>
          ) : (
            paginatedItems.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-foreground font-medium">{s.title}</TableCell>
                <TableCell className="text-accent capitalize">{s.signal_type}</TableCell>
                <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">{s.description}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}</TableCell>
                {isAdmin && isLive && (
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => onDelete(s.id, e)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination page={page} totalPages={totalPages} totalItems={totalItems} startIndex={startIndex} endIndex={endIndex} onPageChange={setPage} />
    </>
  );
};

export default SignalsTable;
