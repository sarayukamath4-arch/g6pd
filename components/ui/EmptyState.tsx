import { FileText, Search, Camera, ClipboardList } from "lucide-react";

interface EmptyStateProps {
  type: "journal" | "search" | "scanner" | "default";
  title?: string;
  description?: string;
}

export function EmptyState({ type, title, description }: EmptyStateProps) {
  const configs = {
    journal: {
      icon: ClipboardList,
      title: title || "No reactions logged yet",
      description: description || "Scan a product label or log a reaction to start tracking patterns.",
    },
    search: {
      icon: Search,
      title: title || "No results found",
      description: description || "Try another search term. GeneGuide does not infer medical conclusions from unknown substances.",
    },
    scanner: {
      icon: Camera,
      title: title || "No scans yet",
      description: description || "Scan a product label to extract ingredients and analyze them.",
    },
    default: {
      icon: FileText,
      title: title || "No data available",
      description: description || "There's nothing to show here yet.",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{config.title}</h3>
      <p className="text-sm text-slate-600 max-w-md">{config.description}</p>
    </div>
  );
}