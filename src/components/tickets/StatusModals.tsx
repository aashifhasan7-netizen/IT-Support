import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import type { Ticket, TicketStatus } from '../../types/ticket';

// Resolve modal
const resolveSchema = z.object({
  resolutionNote: z.string().min(20, 'Resolution note must be at least 20 characters.').max(2000),
});
type ResolveForm = z.infer<typeof resolveSchema>;

interface ResolveTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onResolve: (resolutionNote: string) => Promise<void>;
}

export function ResolveTicketModal({ isOpen, onClose, ticket, onResolve }: ResolveTicketModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResolveForm>({
    resolver: zodResolver(resolveSchema),
  });

  const onSubmit = async (data: ResolveForm) => {
    setIsSubmitting(true);
    try {
      await onResolve(data.resolutionNote);
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resolve Ticket"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Mark as Resolved
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-emerald-700">Resolving: {ticket.ticketNumber}</p>
          <p className="text-sm text-emerald-800 font-medium mt-0.5">{ticket.subject}</p>
        </div>
        <Textarea
          label="Resolution Note"
          required
          placeholder="Describe the steps taken to resolve this issue and what the solution was..."
          rows={5}
          error={errors.resolutionNote?.message}
          {...register('resolutionNote')}
        />
        <p className="text-xs text-slate-500">
          A resolution note is required before closing this ticket. This will be visible to the employee.
        </p>
      </div>
    </Modal>
  );
}

// Change status modal
const statusSchema = z.object({
  status: z.enum(['Open', 'In Progress', 'Resolved']),
});
type StatusForm = z.infer<typeof statusSchema>;

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onChangeStatus: (status: TicketStatus) => Promise<void>;
}

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  'Open': ['In Progress'],
  'In Progress': ['Open', 'Resolved'],
  'Resolved': [],
};

export function ChangeStatusModal({ isOpen, onClose, ticket, onChangeStatus }: ChangeStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const allowed = allowedTransitions[ticket.status];

  const { register, handleSubmit, formState: { errors } } = useForm<StatusForm>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: allowed[0] || ticket.status },
  });

  const onSubmit = async (data: StatusForm) => {
    setIsSubmitting(true);
    try {
      await onChangeStatus(data.status);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Ticket Status"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting} disabled={allowed.length === 0}>
            Update Status
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Current status: <strong>{ticket.status}</strong>
        </p>
        {allowed.length > 0 ? (
          <Select
            label="New Status"
            required
            options={allowed.map(s => ({ value: s, label: s }))}
            error={errors.status?.message}
            {...register('status')}
          />
        ) : (
          <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            This ticket is already resolved and cannot be changed.
          </p>
        )}
      </div>
    </Modal>
  );
}
