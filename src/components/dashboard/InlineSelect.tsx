import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from "lucide-react";

interface InlineSelectProps {
  value: string;
  options: { value: string; label: string }[];
  onSave: (newValue: string) => Promise<void>;
  className?: string;
}

const InlineSelect = ({ value, options, onSave, className }: InlineSelectProps) => {
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);

  const handleChange = async (newValue: string) => {
    if (newValue === value) {
      setEditing(false);
      return;
    }
    setPending(true);
    try {
      await onSave(newValue);
    } finally {
      setPending(false);
      setEditing(false);
    }
  };

  if (!editing) {
    return (
      <span
        className={`cursor-pointer hover:underline hover:decoration-dashed hover:underline-offset-4 hover:decoration-primary/40 capitalize ${className ?? ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        title="Click to edit"
      >
        {value.replace("_", " ")}
      </span>
    );
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Select
        value={value}
        onValueChange={handleChange}
        disabled={pending}
        open={true}
        onOpenChange={(open) => { if (!open) setEditing(false); }}
      >
        <SelectTrigger className="h-7 w-[120px] text-xs bg-muted/30 border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default InlineSelect;
