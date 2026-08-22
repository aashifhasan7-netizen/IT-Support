import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, User, Wrench, FileText } from 'lucide-react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { TicketTimeline } from '../../../components/tickets/TicketTimeline';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { TicketDetailsSkeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/States';
import { ticketService } from '../../../services/ticketService';
import { formatDateTime, formatShortDate } from '../../../utils/dateUtils';

export default function EmployeeTicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ticket, isLoading, isError, refetch } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getTicketById(id!),
    enabled: !!id,
  });

  if (isLoading) return <AppLayout title="Ticket Details" breadcrumb="My Tickets"><TicketDetailsSkeleton /></AppLayout>;
  if (isError || !ticket) return (
    <AppLayout title="Ticket Details" breadcrumb="My Tickets">
      <ErrorState message="We couldn't load this ticket." onRetry={refetch} />
    </AppLayout>
  );

  return (
    <AppLayout title={ticket.ticketNumber} breadcrumb="Employee / My Tickets">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/employee/tickets')}
        className="mb-4"
      >
        Back to My Tickets
      </Button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-sm font-mono font-bold text-blue-600">{ticket.ticketNumber}</span>
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{ticket.subject}</h2>
        <p className="text-sm text-slate-500">Submitted {formatDateTime(ticket.createdAt)}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            {ticket.attachmentName && (
              <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4" />
                {ticket.attachmentName}
              </div>
            )}
          </div>

          {/* Resolution note (if resolved) */}
          {ticket.status === 'Resolved' && ticket.resolutionNote && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-emerald-800 mb-2">✓ Resolution Note</h3>
              <p className="text-sm text-emerald-700 leading-relaxed">{ticket.resolutionNote}</p>
              {ticket.resolvedAt && (
                <p className="text-xs text-emerald-500 mt-2">Resolved on {formatDateTime(ticket.resolvedAt)}</p>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Activity Timeline</h3>
            <TicketTimeline activities={ticket.activities} />
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Ticket Information</h3>
            <dl className="space-y-3">
              {[
                { label: 'Issue Type', value: ticket.issueType, icon: <Tag className="w-3.5 h-3.5" /> },
                { label: 'Category', value: ticket.category, icon: <Tag className="w-3.5 h-3.5" /> },
                { label: 'Priority', value: <PriorityBadge priority={ticket.priority} />, icon: null },
                { label: 'Status', value: <StatusBadge status={ticket.status} />, icon: null },
                { label: 'Created By', value: ticket.createdByName, icon: <User className="w-3.5 h-3.5" /> },
                { label: 'Assigned To', value: ticket.assignedEngineerName || 'Unassigned', icon: <Wrench className="w-3.5 h-3.5" /> },
                { label: 'Created', value: formatShortDate(ticket.createdAt), icon: <Calendar className="w-3.5 h-3.5" /> },
                { label: 'Last Updated', value: formatShortDate(ticket.updatedAt), icon: <Calendar className="w-3.5 h-3.5" /> },
              ].map(item => (
                <div key={item.label}>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{item.label}</dt>
                  <dd className="text-sm text-slate-800">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
