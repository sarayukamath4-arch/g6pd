import { AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";

type BannerType = "info" | "warning" | "error" | "success";

interface InfoBannerProps {
  type?: BannerType;
  title: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function InfoBanner({ 
  type = "info", 
  title, 
  children, 
  dismissible = false,
  onDismiss 
}: InfoBannerProps) {
  const configs = {
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      textColor: "text-blue-800",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
      titleColor: "text-amber-900",
      textColor: "text-amber-800",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      textColor: "text-red-800",
    },
    success: {
      icon: CheckCircle,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
      titleColor: "text-emerald-900",
      textColor: "text-emerald-800",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${config.titleColor} mb-1`}>{title}</h3>
          <p className={`text-sm ${config.textColor} leading-relaxed`}>{children}</p>
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}