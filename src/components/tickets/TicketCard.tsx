import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar } from 'lucide-react';
import type { Ticket } from '../../types/ticket';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { formatShortDate } from '../../utils/dateUtils';
import { motion } from 'framer-motion';

interface TicketCardProps {
  ticket: Ticket;
  linkPrefix: string;
}

export function TicketCard({ ticket, linkPrefix }: TicketCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -1 }}
      onClick={() => navigate(`${linkPrefix}/${ticket.id}`)}
      className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-blue-600 font-mono">{ticket.ticketNumber}</span>
          <h3 className="text-sm font-semibold text-slate-900 truncate mt-0.5">{ticket.subject}</h3>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
          {ticket.category}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{ticket.assignedEngineerName || 'Unassigned'}</span>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatShortDate(ticket.createdAt)}
        </div>
      </div>
    </motion.div>
  );
}
