import type { TicketActivity } from '../../types/ticket';
import { formatDateTime } from '../../utils/dateUtils';
import { CheckCircle2, CircleDot, UserCheck, RotateCcw, FileText, Plus } from 'lucide-react';

const activityIcons: Record<TicketActivity['type'], React.ReactNode> = {
  created: <Plus className="w-3.5 h-3.5 text-slate-500" />,
  assigned: <UserCheck className="w-3.5 h-3.5 text-blue-500" />,
  reassigned: <RotateCcw className="w-3.5 h-3.5 text-amber-500" />,
  status_changed: <CircleDot className="w-3.5 h-3.5 text-blue-500" />,
  resolved: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  note_added: <FileText className="w-3.5 h-3.5 text-slate-500" />,
};

const activityIconBg: Record<TicketActivity['type'], string> = {
  created: 'bg-slate-100',
  assigned: 'bg-blue-50',
  reassigned: 'bg-amber-50',
  status_changed: 'bg-blue-50',
  resolved: 'bg-emerald-50',
  note_added: 'bg-slate-100',
};

interface TicketTimelineProps {
  activities: TicketActivity[];
}

export function TicketTimeline({ activities }: TicketTimelineProps) {
  const sorted = [...activities].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="space-y-0">
      {sorted.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          {/* Icon column */}
          <div className="flex flex-col items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white
              shadow-sm z-10
              ${activityIconBg[activity.type]}
            `}>
              {activityIcons[activity.type]}
            </div>
            {index < sorted.length - 1 && (
              <div className="w-0.5 flex-1 bg-slate-200 my-1" />
            )}
          </div>

          {/* Content */}
          <div className={`pb-6 flex-1 min-w-0 ${index === sorted.length - 1 ? 'pb-0' : ''}`}>
            <p className="text-sm font-semibold text-slate-800">{activity.action}</p>
            <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(activity.timestamp)}</p>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{activity.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
