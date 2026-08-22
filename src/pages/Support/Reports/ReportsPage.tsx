import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AppLayout } from '../../../components/layout/AppLayout';
import { StatCard } from '../../../components/dashboard/StatCard';
import { DashboardSkeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/States';
import { dashboardService } from '../../../services/dashboardService';
import { BarChart3, CheckCircle2, Inbox, AlertOctagon, Clock } from 'lucide-react';

// Order matches priorityDistribution's Low → Medium → High → Critical key order,
// and mirrors the colors used by PriorityBadge, so severity reads consistently
// everywhere in the app (previously Low rendered red and Critical rendered green).
const COLORS = ['#10b981', '#4f46e5', '#f97316', '#ef4444'];

export default function ReportsPage() {
  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['support-reports'],
    queryFn: () => dashboardService.getSupportDashboardStats(),
  });

  if (isLoading) return <AppLayout title="Reports"><DashboardSkeleton /></AppLayout>;
  if (isError) return <AppLayout title="Reports"><ErrorState onRetry={refetch} /></AppLayout>;

  const priorityData = stats ? Object.entries(stats.priorityDistribution).map(([name, value]) => ({ name, value })) : [];
  const statusData = stats ? Object.entries(stats.statusDistribution).map(([name, value]) => ({ name, value })) : [];
  const categoryData = stats?.categoryDistribution?.slice(0, 6) || [];

  return (
    <AppLayout title="Reports" breadcrumb="Support Engineer">
      <div className="mb-6">
        <p className="text-sm text-slate-500">Overview of ticket metrics and team performance.</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Tickets" value={stats?.totalTickets ?? 0} icon={BarChart3} iconBg="bg-slate-100" iconColor="text-slate-600" />
        <StatCard label="Open" value={stats?.openTickets ?? 0} icon={Inbox} iconBg="bg-slate-100" iconColor="text-slate-600" />
        <StatCard label="Critical Active" value={stats?.criticalTickets ?? 0} icon={AlertOctagon} iconBg="bg-red-50" iconColor="text-red-600" />
        <StatCard label="Resolved Today" value={stats?.resolvedToday ?? 0} icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Priority pie chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {priorityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="white" strokeWidth={2} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status bar chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Ticket Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} barSize={40}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category bar chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Top Issue Categories</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryData} layout="vertical" barSize={18}>
            <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} width={130} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </AppLayout>
  );
}
