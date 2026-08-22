import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
}

export function StatCard({ label, value, icon: Icon, iconColor, iconBg, delta, deltaType }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{value}</p>
          {delta && (
            <p className={`text-xs mt-1.5 font-medium
              ${deltaType === 'positive' ? 'text-emerald-600' : ''}
              ${deltaType === 'negative' ? 'text-red-500' : ''}
              ${deltaType === 'neutral' ? 'text-slate-500' : ''}
            `}>
              {delta}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}
