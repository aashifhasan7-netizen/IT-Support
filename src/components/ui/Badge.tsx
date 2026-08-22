import type { TicketStatus, TicketPriority } from '../../types/ticket';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

const variantClasses: Record<string, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      ${variantClasses[variant]}
    `}>
      {children}
    </span>
  );
}

// Status badge
const statusConfig: Record<TicketStatus, { variant: BadgeProps['variant']; dot: string }> = {
  'Open': { variant: 'neutral', dot: 'bg-slate-400' },
  'In Progress': { variant: 'info', dot: 'bg-blue-500' },
  'Resolved': { variant: 'success', dot: 'bg-emerald-500' },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${variantClasses[config.variant ?? 'default']}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

// Priority badge
const priorityConfig: Record<TicketPriority, { classes: string }> = {
  'Low': { classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  'Medium': { classes: 'bg-blue-50 text-blue-700 border border-blue-200' },
  'High': { classes: 'bg-orange-50 text-orange-700 border border-orange-200' },
  'Critical': { classes: 'bg-red-50 text-red-700 border border-red-200' },
};

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityConfig[priority].classes}`}>
      {priority === 'Critical' && <span className="mr-1">⚡</span>}
      {priority}
    </span>
  );
}
