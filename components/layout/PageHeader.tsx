interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wider">
          {eyebrow}
        </p>
      )}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{title}</h1>
          {subtitle && <p className="text-slate-600">{subtitle}</p>}
        </div>
        {action && <div className="mt-2 md:mt-0">{action}</div>}
      </div>
    </div>
  );
}