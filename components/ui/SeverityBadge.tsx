import { Badge } from "@/components/ui/badge";

type SeverityLevel = "Mild" | "Moderate" | "Severe";

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    Mild: "bg-yellow-100 text-yellow-900 border-yellow-300",
    Moderate: "bg-orange-100 text-orange-900 border-orange-300",
    Severe: "bg-red-100 text-red-900 border-red-300",
  };

  return (
    <Badge className={styles[severity]} variant="outline">
      {severity}
    </Badge>
  );
}