export interface EmployeeDashboardStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  totalTickets: number;
}

export interface SupportDashboardStats {
  openTickets: number;
  criticalTickets: number;
  highPriorityTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  totalTickets: number;
  priorityDistribution: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
  statusDistribution: {
    Open: number;
    'In Progress': number;
    Resolved: number;
  };
  categoryDistribution: { category: string; count: number }[];
}
