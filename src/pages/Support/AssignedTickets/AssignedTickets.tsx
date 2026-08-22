import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../../../components/layout/AppLayout';
import { TicketTable } from '../../../components/tickets/TicketTable';
import { TicketCard } from '../../../components/tickets/TicketCard';
import { TicketTableSkeleton } from '../../../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../../../components/ui/States';
import { ticketService } from '../../../services/ticketService';
import { useAuth } from '../../../context/AuthContext';
import { ClipboardList } from 'lucide-react';

export default function AssignedTickets() {
  const { user } = useAuth();

  const { data: tickets, isLoading, isError, refetch } = useQuery({
    queryKey: ['assigned-tickets', user?.id],
    queryFn: () => ticketService.getTickets({ assignedEngineerId: user?.id }),
    enabled: !!user?.id,
  });

  return (
    <AppLayout title="My Assigned Tickets" breadcrumb="Support Engineer">
      <div className="mb-5">
        <p className="text-sm text-slate-500">Tickets currently assigned to you.</p>
      </div>

      {isLoading ? (
        <TicketTableSkeleton />
      ) : isError ? (
        <ErrorState message="Couldn't load your assigned tickets." onRetry={refetch} />
      ) : !tickets || tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-4">
          <EmptyState
            icon={<ClipboardList className="w-6 h-6" />}
            title="No assigned tickets"
            message="You have no tickets currently assigned to you."
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
          <p className="text-xs text-slate-400 mt-3">{tickets.length} assigned ticket{tickets.length !== 1 ? 's' : ''}</p>
        </>
      )}
    </AppLayout>
  );
}
