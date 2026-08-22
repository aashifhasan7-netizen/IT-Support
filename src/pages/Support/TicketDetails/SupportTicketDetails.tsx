import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, RefreshCw, CheckCircle, FileText, Tag, User, Calendar, Wrench } from 'lucide-react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { TicketTimeline } from '../../../components/tickets/TicketTimeline';
import { AssignTicketModal } from '../../../components/tickets/AssignTicketModal';
import { ResolveTicketModal, ChangeStatusModal } from '../../../components/tickets/StatusModals';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { TicketDetailsSkeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/States';
import { ticketService } from '../../../services/ticketService';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';
import { formatDateTime, formatShortDate } from '../../../utils/dateUtils';
import type { TicketStatus } from '../../../types/ticket';
import toast from 'react-hot-toast';

export default function SupportTicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [assignOpen, setAssignOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const { data: ticket, isLoading, isError, refetch } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getTicketById(id!),
    enabled: !!id,
  });

  const { data: engineers } = useQuery({
    queryKey: ['support-engineers'],
    queryFn: () => userService.getSupportEngineers(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['ticket', id] });
    queryClient.invalidateQueries({ queryKey: ['all-tickets'] });
    queryClient.invalidateQueries({ queryKey: ['support-dashboard-stats'] });
  };

  const assignMutation = useMutation({
    mutationFn: (args: { engineerId: string; engineerName: string; previousEngineerName?: string }) =>
      ticketService.assignTicket(id!, args),
    onSuccess: () => {
      invalidate();
      toast.success('Ticket assigned successfully.');
    },
    onError: () => toast.error('Failed to assign ticket.'),
  });

  const statusMutation = useMutation({
    mutationFn: (args: { status: TicketStatus; resolutionNote?: string }) =>
      ticketService.updateTicketStatus(id!, {
        ...args,
        performedBy: user!.name,
        performedById: user!.id,
      }),
    onSuccess: (_, vars) => {
      invalidate();
      toast.success(vars.status === 'Resolved' ? 'Ticket resolved successfully.' : 'Status updated successfully.');
    },
    onError: () => toast.error('Failed to update status.'),
  });

  if (isLoading) return <AppLayout title="Ticket Details"><TicketDetailsSkeleton /></AppLayout>;
  if (isError || !ticket) return (
    <AppLayout title="Ticket Details">
      <ErrorState message="Couldn't load this ticket." onRetry={refetch} />
    </AppLayout>
  );

  const canChangeStatus = ticket.status !== 'Resolved';

  return (
    <AppLayout title={ticket.ticketNumber} breadcrumb="Support / Ticket Queue">
      <Button
        variant="ghost" size="sm"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/support/tickets')}
        className="mb-4"
      >
        Back to Queue
      </Button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-sm font-mono font-bold text-blue-600">{ticket.ticketNumber}</span>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{ticket.subject}</h2>
            <p className="text-sm text-slate-500">Submitted by {ticket.createdByName} · {formatDateTime(ticket.createdAt)}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <Button
              variant="outline" size="sm"
              leftIcon={<UserCheck className="w-4 h-4" />}
              onClick={() => setAssignOpen(true)}
            >
              {ticket.assignedEngineerId ? 'Reassign' : 'Assign'}
            </Button>
            {canChangeStatus && ticket.status !== 'In Progress' && (
              <Button
                variant="outline" size="sm"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={() => setStatusOpen(true)}
              >
                Change Status
              </Button>
            )}
            {canChangeStatus && (
              <Button
                size="sm"
                leftIcon={<CheckCircle className="w-4 h-4" />}
                onClick={() => ticket.status === 'In Progress' ? setResolveOpen(true) : setStatusOpen(true)}
              >
                {ticket.status === 'In Progress' ? 'Resolve' : 'Update Status'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            {ticket.attachmentName && (
              <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4" /> {ticket.attachmentName}
              </div>
            )}
          </div>

          {/* Resolution note if resolved */}
          {ticket.status === 'Resolved' && ticket.resolutionNote && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-emerald-800 mb-2">✓ Resolution Note</h3>
              <p className="text-sm text-emerald-700 leading-relaxed">{ticket.resolutionNote}</p>
              {ticket.resolvedAt && (
                <p className="text-xs text-emerald-500 mt-2">Resolved {formatDateTime(ticket.resolvedAt)}</p>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Activity Timeline</h3>
            <TicketTimeline activities={ticket.activities} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Ticket Information</h3>
            <dl className="space-y-3">
              {[
                { label: 'Issue Type', value: ticket.issueType },
                { label: 'Category', value: ticket.category },
                { label: 'Priority', value: <PriorityBadge priority={ticket.priority} /> },
                { label: 'Status', value: <StatusBadge status={ticket.status} /> },
                { label: 'Created By', value: ticket.createdByName },
                { label: 'Department', value: ticket.createdByDepartment || '—' },
                { label: 'Assigned To', value: ticket.assignedEngineerName || <span className="text-slate-400 italic text-xs">Unassigned</span> },
                { label: 'Created', value: formatShortDate(ticket.createdAt) },
                { label: 'Last Updated', value: formatShortDate(ticket.updatedAt) },
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

      {/* Modals */}
      {assignOpen && engineers && (
        <AssignTicketModal
          isOpen={assignOpen}
          onClose={() => setAssignOpen(false)}
          ticket={ticket}
          engineers={engineers}
          onAssign={async (engineerId, engineerName, prev) => {
            await assignMutation.mutateAsync({ engineerId, engineerName, previousEngineerName: prev });
          }}
        />
      )}

      {resolveOpen && (
        <ResolveTicketModal
          isOpen={resolveOpen}
          onClose={() => setResolveOpen(false)}
          ticket={ticket}
          onResolve={async note => { await statusMutation.mutateAsync({ status: 'Resolved', resolutionNote: note }); }}
        />
      )}

      {statusOpen && (
        <ChangeStatusModal
          isOpen={statusOpen}
          onClose={() => setStatusOpen(false)}
          ticket={ticket}
          onChangeStatus={async status => {
            if (status === 'Resolved') {
              setStatusOpen(false);
              setResolveOpen(true);
              return;
            }
            await statusMutation.mutateAsync({ status });
          }}
        />
      )}
    </AppLayout>
  );
}
