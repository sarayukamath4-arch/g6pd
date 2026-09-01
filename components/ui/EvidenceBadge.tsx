import { Badge } from "@/components/ui/badge";

type EvidenceLevel = "High Risk" | "Low Risk" | "Inconclusive" | "No Documented Relation";

interface EvidenceBadgeProps {
  level: EvidenceLevel;
}

export function EvidenceBadge({ level }: EvidenceBadgeProps) {
  const styles = {
    "High Risk": "bg-[hsl(var(--evidence-high-risk))] text-amber-900 border-amber-300",
    "Low Risk": "bg-[hsl(var(--evidence-low-risk))] text-blue-900 border-blue-300",
    "Inconclusive": "bg-[hsl(var(--evidence-inconclusive))] text-slate-800 border-slate-300",
    "No Documented Relation": "bg-[hsl(var(--evidence-no-relation))] text-emerald-800 border-emerald-200",
  };

  return (
    <Badge className={styles[level]} variant="outline">
      {level}
    </Badge>
  );
}