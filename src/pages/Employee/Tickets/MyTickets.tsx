import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket, Search } from 'lucide-react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { TicketTable } from '../../../components/tickets/TicketTable';
import { TicketCard } from '../../../components/tickets/TicketCard';
import { TicketFiltersBar } from '../../../components/tickets/TicketFilters';
import { TicketTableSkeleton } from '../../../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../../../components/ui/States';
import { Button } from '../../../components/ui/Button';
import { ticketService } from '../../../services/ticketService';
import type { TicketFilters } from '../../../types/ticket';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TicketFilters>({ sortBy: 'newest' });

  const { data: tickets, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-tickets', filters],
    queryFn: () => ticketService.getMyTickets(filters),
  });

  return (
    <AppLayout title="My Tickets" breadcrumb="Employee">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <p className="text-sm text-slate-500">Track and manage all your submitted support tickets.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/employee/tickets/create')} size="sm">
          New Ticket
        </Button>
      </div>

      <TicketFiltersBar filters={filters} onChange={setFilters} />

      <div className="mt-4">
        {isLoading ? (
          <TicketTableSkeleton />
        ) : isError ? (
          <ErrorState
            message="We couldn't load your tickets."
            onRetry={refetch}
          />
        ) : !tickets || tickets.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-4">
            <EmptyState
              icon={<Search className="w-6 h-6" />}
              title={filters.search || filters.status || filters.priority ? 'No tickets match your filters' : 'No tickets yet'}
              message={filters.search || filters.status || filters.priority
                ? 'Try adjusting or clearing your filters to see more results.'
                : 'Submit a support ticket to get help from our IT team.'}
              action={
                filters.search || filters.status || filters.priority ? (
                  <Button variant="outline" size="sm" onClick={() => setFilters({ sortBy: 'newest' })}>Clear Filters</Button>
                ) : (
                  <Button size="sm" onClick={() => navigate('/employee/tickets/create')} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Create Ticket
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <TicketTable tickets={tickets} linkPrefix="/employee/tickets" />
            </div>
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {tickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} linkPrefix="/employee/tickets" />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found</p>
          </>
        )}
      </div>
    </AppLayout>
  );
}
