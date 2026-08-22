import { useNavigate } from 'react-router-dom';
import type { Ticket } from '../../types/ticket';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { formatShortDate } from '../../utils/dateUtils';
import { Button } from '../ui/Button';
import { Eye } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  linkPrefix: string;
  showEmployee?: boolean;
  onViewTicket?: (ticket: Ticket) => void;
}

export function TicketTable({ tickets, linkPrefix, showEmployee = false }: TicketTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">Ticket</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
              {showEmployee && (
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Employee</th>
              )}
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32 hidden md:table-cell">Assignee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-28 hidden lg:table-cell">Created</th>
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => navigate(`${linkPrefix}/${ticket.id}`)}
              >
                <td className="px-4 py-3">
                  <span className="text-xs font-mono font-semibold text-blue-600">{ticket.ticketNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900 truncate max-w-xs">{ticket.subject}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{ticket.category}</p>
                  </div>
                </td>
                {showEmployee && (
                  <td className="px-4 py-3 text-slate-700 text-sm">{ticket.createdByName}</td>
                )}
                <td className="px-4 py-3">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3 text-slate-500 text-sm hidden md:table-cell">
                  {ticket.assignedEngineerName || (
                    <span className="text-slate-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 text-sm hidden lg:table-cell">
                  {formatShortDate(ticket.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`${linkPrefix}/${ticket.id}`);
                    }}
                    aria-label={`View ticket ${ticket.ticketNumber}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
