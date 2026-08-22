import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { TicketFilters } from '../../types/ticket';

interface TicketFiltersProps {
  filters: TicketFilters;
  onChange: (filters: TicketFilters) => void;
  showAssignee?: boolean;
  engineers?: { id: string; name: string }[];
}

const statusOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
];

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' },
];

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

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest_priority', label: 'Highest Priority' },
  { value: 'recently_updated', label: 'Recently Updated' },
];

export function TicketFiltersBar({ filters, onChange, showAssignee = false, engineers = [] }: TicketFiltersProps) {
  const hasActiveFilters = !!(filters.status || filters.priority || filters.issueType || filters.category || filters.assignedEngineerId);

  const clearFilters = () => {
    onChange({ ...filters, status: '', priority: '', issueType: '', category: '', assignedEngineerId: '', search: '' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Search tickets..."
            value={filters.search || ''}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        {/* Sort */}
        <div className="w-full sm:w-48">
          <Select
            options={sortOptions}
            value={filters.sortBy || 'newest'}
            onChange={e => onChange({ ...filters, sortBy: e.target.value as TicketFilters['sortBy'] })}
            placeholder="Sort by..."
          />
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2 items-center">
        <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <div className="w-36">
          <Select
            options={statusOptions}
            value={filters.status || ''}
            onChange={e => onChange({ ...filters, status: e.target.value as TicketFilters['status'] })}
            placeholder="All Statuses"
          />
        </div>
        <div className="w-32">
          <Select
            options={priorityOptions}
            value={filters.priority || ''}
            onChange={e => onChange({ ...filters, priority: e.target.value as TicketFilters['priority'] })}
            placeholder="All Priorities"
          />
        </div>
        <div className="w-32">
          <Select
            options={issueTypeOptions}
            value={filters.issueType || ''}
            onChange={e => onChange({ ...filters, issueType: e.target.value as TicketFilters['issueType'] })}
            placeholder="Issue Type"
          />
        </div>
        <div className="w-44">
          <Select
            options={categoryOptions}
            value={filters.category || ''}
            onChange={e => onChange({ ...filters, category: e.target.value as TicketFilters['category'] })}
            placeholder="All Categories"
          />
        </div>
        {showAssignee && engineers.length > 0 && (
          <div className="w-44">
            <Select
              options={engineers.map(e => ({ value: e.id, label: e.name }))}
              value={filters.assignedEngineerId || ''}
              onChange={e => onChange({ ...filters, assignedEngineerId: e.target.value })}
              placeholder="All Engineers"
            />
          </div>
        )}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<X className="w-3.5 h-3.5" />}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
