import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: number;
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="flat-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend !== undefined && (
            <p
              className={`text-sm font-medium mt-1 ${
                trend >= 0 ? 'text-success' : 'text-destructive'
              }`}
            >
              {trend >= 0 ? '+' : ''}
              {trend.toFixed(2)}%
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
