export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueType = 'Hardware' | 'Software';
export type TicketCategory =
  | 'Laptop'
  | 'Desktop'
  | 'Monitor'
  | 'Printer'
  | 'Network'
  | 'Email'
  | 'Software Installation'
  | 'Application Error'
  | 'Operating System'
  | 'Other';

export interface TicketActivity {
  id: string;
  ticketId: string;
  action: string;
  description: string;
  performedBy: string;
  performedById: string;
  timestamp: string;
  type: 'created' | 'assigned' | 'status_changed' | 'resolved' | 'note_added' | 'reassigned';
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  issueType: IssueType;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdById: string;
  createdByName: string;
  createdByEmail: string;
  createdByDepartment?: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  attachmentName?: string;
  activities: TicketActivity[];
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  issueType: IssueType;
  category: TicketCategory;
  priority: TicketPriority;
  attachmentName?: string;
}

export interface AssignTicketRequest {
  engineerId: string;
  engineerName: string;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
  resolutionNote?: string;
}

export interface TicketFilters {
  search?: string;
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
  issueType?: IssueType | '';
  category?: TicketCategory | '';
  assignedEngineerId?: string;
  sortBy?: 'newest' | 'oldest' | 'highest_priority' | 'recently_updated';
}
