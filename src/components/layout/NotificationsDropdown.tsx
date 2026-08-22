import { useMemo, useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, UserPlus, RefreshCcw, CheckCircle2, MessageSquare, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { formatRelativeTime } from '../../utils/dateUtils';
import type { TicketActivity } from '../../types/ticket';

interface FeedItem extends TicketActivity {
  ticketNumber: string;
  ticketSubject: string;
}

const iconByType: Record<TicketActivity['type'], React.ReactNode> = {
  created: <FileText className="w-4 h-4" />,
  assigned: <UserPlus className="w-4 h-4" />,
  reassigned: <UserPlus className="w-4 h-4" />,
  status_changed: <RefreshCcw className="w-4 h-4" />,
  resolved: <CheckCircle2 className="w-4 h-4" />,
  note_added: <MessageSquare className="w-4 h-4" />,
};

const colorByType: Record<TicketActivity['type'], string> = {
  created: 'bg-slate-100 text-slate-500',
  assigned: 'bg-blue-50 text-blue-600',
  reassigned: 'bg-blue-50 text-blue-600',
  status_changed: 'bg-amber-50 text-amber-600',
  resolved: 'bg-emerald-50 text-emerald-600',
  note_added: 'bg-purple-50 text-purple-600',
};

export function NotificationsDropdown() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const isEmployee = user?.role === 'EMPLOYEE';

  const { data: tickets } = useQuery({
    queryKey: ['notifications-feed', user?.id, isEmployee],
    queryFn: () =>
      isEmployee
        ? ticketService.getMyTickets()
        : ticketService.getTickets({ sortBy: 'newest' }),
    staleTime: 30 * 1000,
    enabled: !!user,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const feed: FeedItem[] = useMemo(() => {
    if (!tickets) return [];
    const items: FeedItem[] = [];
    for (const ticket of tickets) {
      for (const activity of ticket.activities || []) {
        // Skip the "created" event on your own ticket — not a notification-worthy event for its author.
        if (activity.type === 'created' && activity.performedById === user?.id) continue;
        items.push({ ...activity, ticketNumber: ticket.ticketNumber, ticketSubject: ticket.subject });
      }
    }
    return items
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [tickets, user?.id]);

  const unreadCount = feed.filter(item => !readIds.has(item.id)).length;

  const openTicket = (item: FeedItem, ticketId: string) => {
    setReadIds(prev => new Set(prev).add(item.id));
    setOpen(false);
    navigate(isEmployee ? `/employee/tickets/${ticketId}` : `/support/tickets/${ticketId}`);
  };

  const markAllRead = () => {
    setReadIds(new Set(feed.map(item => item.id)));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-blue-600 text-white text-[10px] font-semibold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {feed.length === 0 ? (
                <div className="py-10 text-center px-4">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">You're all caught up.</p>
                </div>
              ) : (
                feed.map(item => {
                  const isUnread = !readIds.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => openTicket(item, item.ticketId)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${isUnread ? 'bg-blue-50/40' : ''}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorByType[item.type]}`}>
                        {iconByType[item.type]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-semibold text-blue-600">{item.ticketNumber}</span>
                          {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                        </span>
                        <span className="block text-sm text-slate-700 truncate">{item.description}</span>
                        <span className="block text-xs text-slate-400 mt-0.5">{formatRelativeTime(item.timestamp)}</span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
