import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Paperclip, X } from 'lucide-react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { ticketService } from '../../../services/ticketService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters.').max(150, 'Subject is too long.'),
  description: z.string().min(20, 'Description must be at least 20 characters.').max(5000, 'Description is too long.'),
  issueType: z.enum(['Hardware', 'Software'] as const),
  category: z.enum([
    'Laptop', 'Desktop', 'Monitor', 'Printer', 'Network',
    'Email', 'Software Installation', 'Application Error', 'Operating System', 'Other'
  ] as const),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical'] as const),
});

type CreateTicketForm = z.infer<typeof createTicketSchema>;

const issueTypeOptions = [
  { value: 'Hardware', label: 'Hardware' },
  { value: 'Software', label: 'Software' },
];

const categoryOptions = [
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Printer', label: 'Printer' },
  { value: 'Network', label: 'Network' },
  { value: 'Email', label: 'Email' },
  { value: 'Software Installation', label: 'Software Installation' },
  { value: 'Application Error', label: 'Application Error' },
  { value: 'Operating System', label: 'Operating System' },
  { value: 'Other', label: 'Other' },
];

const priorityOptions = [
  { value: 'Low', label: 'Low — Non-urgent, can wait' },
  { value: 'Medium', label: 'Medium — Affects productivity' },
  { value: 'High', label: 'High — Significant impact' },
  { value: 'Critical', label: 'Critical — Complete work stoppage' },
];

const priorityColors: Record<string, string> = {
  Low: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  Medium: 'border-blue-300 bg-blue-50 text-blue-700',
  High: 'border-orange-300 bg-orange-50 text-orange-700',
  Critical: 'border-red-300 bg-red-50 text-red-700',
};

export default function CreateTicketPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [attachmentName, setAttachmentName] = useState('');

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { priority: 'Medium' },
  });

  const selectedPriority = watch('priority');

  const mutation = useMutation({
    mutationFn: (data: CreateTicketForm) =>
      ticketService.createTicket({
        ...data,
        createdByName: user!.name,
        createdByEmail: user!.email,
        attachmentName: attachmentName || undefined,
      }),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['employee-dashboard-stats'] });
      toast.success(`Ticket ${ticket.ticketNumber} created successfully!`);
      navigate(`/employee/tickets/${ticket.id}`);
    },
    onError: () => {
      toast.error('Failed to create ticket. Please try again.');
    },
  });

  return (
    <AppLayout title="Create Support Ticket" breadcrumb="Employee / My Tickets">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-slate-500 mb-6">
            Fill in the details below to submit a new IT support request. Our team will review and respond promptly.
          </p>

          <form onSubmit={handleSubmit(d => mutation.mutate(d))} noValidate className="space-y-5">
            {/* Issue type + category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Issue Type"
                required
                options={issueTypeOptions}
                placeholder="Select issue type..."
                error={errors.issueType?.message}
                {...register('issueType')}
              />
              <Select
                label="Category"
                required
                options={categoryOptions}
                placeholder="Select category..."
                error={errors.category?.message}
                {...register('category')}
              />
            </div>

            {/* Subject */}
            <Input
              label="Subject"
              required
              placeholder="Brief description of the issue (e.g. Laptop Wi-Fi not connecting)"
              error={errors.subject?.message}
              {...register('subject')}
            />

            {/* Description */}
            <Textarea
              label="Description"
              required
              placeholder="Provide a detailed description of the issue, when it started, what you've already tried, and any error messages you see..."
              rows={6}
              error={errors.description?.message}
              {...register('description')}
            />

            {/* Priority */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">
                Priority / Severity <span className="text-red-500">*</span>
              </p>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {priorityOptions.map(opt => (
                      <label
                        key={opt.value}
                        className={`
                          flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all duration-150
                          ${field.value === opt.value
                            ? priorityColors[opt.value]
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
                        `}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          checked={field.value === opt.value}
                          onChange={() => field.onChange(opt.value)}
                          className="sr-only"
                        />
                        <span className="font-semibold text-sm">{opt.value}</span>
                        <span className="text-xs mt-0.5 opacity-80 leading-tight">
                          {opt.label.split(' — ')[1]}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              />
              {errors.priority && <p className="text-xs text-red-600 mt-1.5">{errors.priority.message}</p>}
            </div>

            {/* Attachment */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1.5">Attachment <span className="text-slate-400 font-normal">(optional)</span></p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm text-slate-600">
                  <Paperclip className="w-4 h-4" />
                  {attachmentName ? 'Change file' : 'Attach file'}
                  <input
                    type="file"
                    className="sr-only"
                    onChange={e => setAttachmentName(e.target.files?.[0]?.name || '')}
                  />
                </label>
                {attachmentName && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <span className="truncate max-w-[200px]">{attachmentName}</span>
                    <button type="button" onClick={() => setAttachmentName('')} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <Button
                type="submit"
                isLoading={mutation.isPending}
                size="lg"
              >
                Submit Ticket
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/employee/tickets')}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppLayout>
  );
}
