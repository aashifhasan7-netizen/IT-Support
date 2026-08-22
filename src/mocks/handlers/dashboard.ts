import { http, HttpResponse } from 'msw';
import { mockTickets } from '../data/tickets';

export const dashboardHandlers = [
  http.get('/api/dashboard/employee', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const userId = atob(auth.replace('Bearer ', '')).split(':')[0];
    const myTickets = mockTickets.filter(t => t.createdById === userId);

    const stats = {
      openTickets: myTickets.filter(t => t.status === 'Open').length,
      inProgressTickets: myTickets.filter(t => t.status === 'In Progress').length,
      resolvedTickets: myTickets.filter(t => t.status === 'Resolved').length,
      totalTickets: myTickets.length,
    };

    return HttpResponse.json({ success: true, message: 'OK', data: stats });
  }),

  http.get('/api/dashboard/support', () => {
    const today = new Date().toDateString();
    const resolvedToday = mockTickets.filter(t =>
      t.status === 'Resolved' && t.resolvedAt && new Date(t.resolvedAt).toDateString() === today
    ).length;

    const categoryMap: Record<string, number> = {};
    mockTickets.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
    });

    const stats = {
      openTickets: mockTickets.filter(t => t.status === 'Open').length,
      criticalTickets: mockTickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved').length,
      highPriorityTickets: mockTickets.filter(t => t.priority === 'High' && t.status !== 'Resolved').length,
      inProgressTickets: mockTickets.filter(t => t.status === 'In Progress').length,
      resolvedToday,
      totalTickets: mockTickets.length,
      priorityDistribution: {
        Low: mockTickets.filter(t => t.priority === 'Low').length,
        Medium: mockTickets.filter(t => t.priority === 'Medium').length,
        High: mockTickets.filter(t => t.priority === 'High').length,
        Critical: mockTickets.filter(t => t.priority === 'Critical').length,
      },
      statusDistribution: {
        Open: mockTickets.filter(t => t.status === 'Open').length,
        'In Progress': mockTickets.filter(t => t.status === 'In Progress').length,
        Resolved: mockTickets.filter(t => t.status === 'Resolved').length,
      },
      categoryDistribution: Object.entries(categoryMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count),
    };

    return HttpResponse.json({ success: true, message: 'OK', data: stats });
  }),
];
