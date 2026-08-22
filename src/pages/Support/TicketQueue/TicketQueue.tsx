import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { TicketTable } from '../../../components/tickets/TicketTable';
import { TicketCard } from '../../../components/tickets/TicketCard';
import { TicketFiltersBar } from '../../../components/tickets/TicketFilters';
import { TicketTableSkeleton } from '../../../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../../../components/ui/States';
import { Button } from '../../../components/ui/Button';
import { ticketService } from '../../../services/ticketService';
import { userService } from '../../../services/userService';
import type { TicketFilters } from '../../../types/ticket';

export default function TicketQueue() {
  const [filters, setFilters] = useState<TicketFilters>({ sortBy: 'newest' });
  const queryClient = useQueryClient();

  const { data: tickets, isLoading, isError, refetch } = useQuery({
    queryKey: ['all-tickets', filters],
    queryFn: () => ticketService.getTickets(filters),
  });

  const { data: engineers } = useQuery({
    queryKey: ['support-engineers'],
    queryFn: () => userService.getSupportEngineers(),
  });

  return (
    <AppLayout title="Ticket Queue" breadcrumb="Support Engineer">
      <div className="mb-5">
        <p className="text-sm text-slate-500">View, search, filter and manage all incoming support tickets.</p>
      </div>

      <TicketFiltersBar
        filters={filters}
        onChange={setFilters}
        showAssignee
        engineers={engineers?.map(e => ({ id: e.id, name: e.name })) || []}
      />

      <div className="mt-4">
        {isLoading ? (
          <TicketTableSkeleton />
        ) : isError ? (
          <ErrorState message="We couldn't load the ticket queue." onRetry={refetch} />
        ) : !tickets || tickets.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-4">
            <EmptyState
              icon={<Search className="w-6 h-6" />}
              title="No tickets found"
              message="There are no tickets matching your current filters."
              action={
                <Button variant="outline" size="sm" onClick={() => setFilters({ sortBy: 'newest' })}>
                  Clear Filters
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <TicketTable tickets={tickets} linkPrefix="/support/tickets" showEmployee />
            </div>
            <div className="md:hidden space-y-3">
              {tickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} linkPrefix="/support/tickets" />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found</p>
          </>
        )}
      </div>
    </AppLayout>
  );
}
