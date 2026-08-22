import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Ticket, Clock, CheckCircle, LayoutDashboard, Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../../components/layout/AppLayout';
import { StatCard } from '../../../components/dashboard/StatCard';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { DashboardSkeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/States';
import { dashboardService } from '../../../services/dashboardService';
import { ticketService } from '../../../services/ticketService';
import { useAuth } from '../../../context/AuthContext';
import { formatShortDate } from '../../../utils/dateUtils';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const statsQuery = useQuery({
    queryKey: ['employee-dashboard-stats'],
    queryFn: () => dashboardService.getEmployeeDashboardStats(),
  });

  const recentQuery = useQuery({
    queryKey: ['my-tickets-recent'],
    queryFn: () => ticketService.getMyTickets(),
  });

  const isLoading = statsQuery.isLoading || recentQuery.isLoading;
  const isError = statsQuery.isError || recentQuery.isError;

  if (isLoading) return <AppLayout title="My Support Dashboard"><DashboardSkeleton /></AppLayout>;
  if (isError) return (
    <AppLayout title="My Support Dashboard">
      <ErrorState onRetry={() => { statsQuery.refetch(); recentQuery.refetch(); }} />
    </AppLayout>
  );

  const stats = statsQuery.data;
  const recent = recentQuery.data?.slice(0, 8) || [];

  return (
    <AppLayout title="My Support Dashboard" breadcrumb="Employee">
      {/* Welcome bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Good day, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Here's an overview of your support tickets.</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/employee/tickets/create')}
          size="md"
        >
          Create Support Ticket
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Open Tickets"
          value={stats?.openTickets ?? 0}
          icon={Ticket}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgressTickets ?? 0}
          icon={Clock}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Resolved"
          value={stats?.resolvedTickets ?? 0}
          icon={CheckCircle}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Total Tickets"
          value={stats?.totalTickets ?? 0}
          icon={LayoutDashboard}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm">Recent Tickets</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/employee/tickets')} rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
            View all
          </Button>
        </div>

        {recent.length === 0 ? (
          <div className="py-12 text-center">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">No tickets yet</p>
            <p className="text-slate-400 text-xs mt-1">Create your first support ticket to get started.</p>
            <Button className="mt-4" size="sm" onClick={() => navigate('/employee/tickets/create')} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Create Ticket
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticket</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Assigned To</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((ticket, i) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => navigate(`/employee/tickets/${ticket.id}`)}
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors last:border-0"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono font-semibold text-blue-600">{ticket.ticketNumber}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900 truncate max-w-[200px]">{ticket.subject}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">{ticket.category}</td>
                    <td className="px-5 py-3.5"><PriorityBadge priority={ticket.priority} /></td>
                    <td className="px-5 py-3.5"><StatusBadge status={ticket.status} /></td>
                    <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                      {ticket.assignedEngineerName || <span className="text-slate-400 italic text-xs">Unassigned</span>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">{formatShortDate(ticket.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
