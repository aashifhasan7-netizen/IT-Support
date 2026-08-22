import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { StatusBadge, PriorityBadge } from '../ui/Badge';

export function GlobalSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isEmployee = user?.role === 'EMPLOYEE';

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), 250);
    return () => clearTimeout(id);
  }, [term]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: results, isFetching } = useQuery({
    queryKey: ['global-search', debounced, isEmployee],
    queryFn: () =>
      isEmployee
        ? ticketService.getMyTickets({ search: debounced })
        : ticketService.getTickets({ search: debounced }),
    enabled: debounced.length >= 2,
    staleTime: 10 * 1000,
  });

  const showPanel = focused && debounced.length >= 2;
  const list = (results || []).slice(0, 6);

  const goTo = (id: string) => {
    setFocused(false);
    setTerm('');
    navigate(isEmployee ? `/employee/tickets/${id}` : `/support/tickets/${id}`);
  };

  return (
    <div className="relative hidden md:block w-full max-w-xs" ref={ref}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          value={term}
          onChange={e => setTerm(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search tickets by subject or number..."
          className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 border border-transparent rounded-lg placeholder:text-slate-400 focus:bg-white focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {term && (
          <button
            onClick={() => { setTerm(''); setDebounced(''); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1.5 w-96 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {isFetching ? (
              <div className="py-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </div>
            ) : list.length === 0 ? (
              <div className="py-8 text-center px-4">
                <p className="text-sm text-slate-500">No tickets match "{debounced}"</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto py-1.5">
                {list.map(ticket => (
                  <button
                    key={ticket.id}
                    onClick={() => goTo(ticket.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-blue-600">{ticket.ticketNumber}</span>
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <p className="text-sm text-slate-800 truncate mt-0.5">{ticket.subject}</p>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
