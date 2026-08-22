import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Ticket } from '../../types/ticket';
import type { User } from '../../types/auth';

const assignSchema = z.object({
  engineerId: z.string().min(1, 'Please select an engineer.'),
});

type AssignForm = z.infer<typeof assignSchema>;

interface AssignTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  engineers: User[];
  onAssign: (engineerId: string, engineerName: string, previousEngineerName?: string) => Promise<void>;
}

export function AssignTicketModal({ isOpen, onClose, ticket, engineers, onAssign }: AssignTicketModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AssignForm>({
    resolver: zodResolver(assignSchema),
    defaultValues: { engineerId: ticket.assignedEngineerId || '' },
  });

  const onSubmit = async (data: AssignForm) => {
    const engineer = engineers.find(e => e.id === data.engineerId);
    if (!engineer) return;
    setIsSubmitting(true);
    try {
      await onAssign(engineer.id, engineer.name, ticket.assignedEngineerName);
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
      title="Assign Ticket"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>Assign</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-500">Ticket</p>
          <p className="text-sm font-semibold text-slate-800">{ticket.ticketNumber} — {ticket.subject}</p>
        </div>
        {ticket.assignedEngineerName && (
          <p className="text-sm text-slate-600">
            Currently assigned to: <strong>{ticket.assignedEngineerName}</strong>
          </p>
        )}
        <Select
          label="Select Engineer"
          required
          options={engineers.map(e => ({ value: e.id, label: e.name }))}
          placeholder="Choose an engineer..."
          error={errors.engineerId?.message}
          {...register('engineerId')}
        />
      </div>
    </Modal>
  );
}
