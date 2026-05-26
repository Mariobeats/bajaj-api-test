import { AlertTriangle, CheckCircle2, Clock3, ListChecks, LockKeyhole } from 'lucide-react';
import { statusLabels } from '../utils/tickets.js';

export default function StatsStrip({ stats }) {
  const items = [
    { label: statusLabels.open, value: stats?.statusCounts.open ?? 0, icon: Clock3 },
    { label: statusLabels.in_progress, value: stats?.statusCounts.in_progress ?? 0, icon: ListChecks },
    { label: statusLabels.resolved, value: stats?.statusCounts.resolved ?? 0, icon: CheckCircle2 },
    { label: statusLabels.closed, value: stats?.statusCounts.closed ?? 0, icon: LockKeyhole },
    { label: 'SLA Breached', value: stats?.breachedCount ?? 0, icon: AlertTriangle }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="border border-line bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted">{item.label}</span>
              <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
            </div>
            <div className="mt-2 text-2xl font-semibold">{item.value}</div>
          </div>
        );
      })}
    </section>
  );
}
