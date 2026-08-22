import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Inbox, AlertOctagon, Flame, Clock, CheckCircle2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../../components/layout/AppLayout';
import { StatCard } from '../../../components/dashboard/StatCard';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { DashboardSkeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/States';
import { dashboardService } from '../../../services/dashboardService';
import { ticketService } from '../../../services/ticketService';
import { formatShortDate } from '../../../utils/dateUtils';

export default function SupportDashboard() {
  const navigate = useNavigate();

  const statsQuery = useQuery({
    queryKey: ['support-dashboard-stats'],
    queryFn: () => dashboardService.getSupportDashboardStats(),
    refetchInterval: 30000,
  });

  const recentQuery = useQuery({
    queryKey: ['all-tickets-recent'],
    queryFn: () => ticketService.getTickets({ sortBy: 'newest' }),
  });

  const isLoading = statsQuery.isLoading || recentQuery.isLoading;
  const isError = statsQuery.isError;

  if (isLoading) return <AppLayout title="Support Operations"><DashboardSkeleton /></AppLayout>;
  if (isError) return (
    <AppLayout title="Support Operations">
      <ErrorState onRetry={() => statsQuery.refetch()} />
    </AppLayout>
  );

  const stats = statsQuery.data;
  const recent = recentQuery.data?.slice(0, 10) || [];

  return (
    <AppLayout title="Support Operations" breadcrumb="Support Engineer">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-slate-500">Real-time overview of all support tickets and workload.</p>
        </div>
        <Button size="sm" onClick={() => navigate('/support/tickets')} leftIcon={<Inbox className="w-4 h-4" />}>
          Open Ticket Queue
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Open Tickets" value={stats?.openTickets ?? 0} icon={Inbox} iconBg="bg-slate-100" iconColor="text-slate-600" />
        <StatCard label="Critical" value={stats?.criticalTickets ?? 0} icon={AlertOctagon} iconBg="bg-red-50" iconColor="text-red-600" />
        <StatCard label="High Priority" value={stats?.highPriorityTickets ?? 0} icon={Flame} iconBg="bg-orange-50" iconColor="text-orange-600" />
        <StatCard label="In Progress" value={stats?.inProgressTickets ?? 0} icon={Clock} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Resolved Today" value={stats?.resolvedToday ?? 0} icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      {/* Distribution row */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* Priority distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {stats && Object.entries(stats.priorityDistribution).map(([priority, count]) => {
              const total = stats.totalTickets || 1;
              const pct = Math.round((count / total) * 100);
              const colors: Record<string, string> = {
                Critical: 'bg-red-500',
                High: 'bg-orange-500',
                Medium: 'bg-blue-500',
                Low: 'bg-emerald-500',
              };
              return (
                <div key={priority}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium">{priority}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full ${colors[priority]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Status Overview</h3>
          <div className="space-y-3">
            {stats && Object.entries(stats.statusDistribution).map(([status, count]) => {
              const total = stats.totalTickets || 1;
              const pct = Math.round((count / total) * 100);
              const colors: Record<string, string> = {
                Open: 'bg-slate-400',
                'In Progress': 'bg-blue-500',
                Resolved: 'bg-emerald-500',
              };
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium">{status}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                      className={`h-full rounded-full ${colors[status]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent tickets */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm">Recent Tickets</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/support/tickets')}>View queue →</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Ticket', 'Subject', 'Employee', 'Priority', 'Status', 'Assignee', 'Created'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((ticket, i) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => navigate(`/support/tickets/${ticket.id}`)}
                  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer last:border-0"
                >
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono font-bold text-blue-600">{ticket.ticketNumber}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-900 truncate max-w-[180px]">{ticket.subject}</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{ticket.createdByName}</td>
                  <td className="px-4 py-3.5"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="px-4 py-3.5"><StatusBadge status={ticket.status} /></td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {ticket.assignedEngineerName || <span className="text-slate-400 italic text-xs">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{formatShortDate(ticket.createdAt)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
