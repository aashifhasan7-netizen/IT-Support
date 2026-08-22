import { http, HttpResponse } from 'msw';
import { mockTickets, generateTicketNumber, addTicket, updateTicket, getTicketById } from '../data/tickets';
import { mockUsers } from '../data/users';
import type { Ticket, TicketActivity, CreateTicketRequest, AssignTicketRequest, UpdateTicketStatusRequest } from '../../types/ticket';

function getUserIdFromRequest(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  try {
    const token = auth.replace('Bearer ', '');
    return atob(token).split(':')[0];
  } catch {
    return null;
  }
}

// Seed tickets don't carry the submitter's department directly, so it's
// resolved from the user directory here — keeps it in sync with the user's
// current department instead of duplicating/hardcoding it on every ticket.
function withDepartment(ticket: Ticket): Ticket {
  return {
    ...ticket,
    createdByDepartment: mockUsers.find(u => u.id === ticket.createdById)?.department,
  };
}

export const ticketHandlers = [
  // GET all tickets (support engineers)
  http.get('/api/tickets', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status') || '';
    const priority = url.searchParams.get('priority') || '';
    const issueType = url.searchParams.get('issueType') || '';
    const category = url.searchParams.get('category') || '';
    const assignedEngineerId = url.searchParams.get('assignedEngineerId') || '';
    const sortBy = url.searchParams.get('sortBy') || 'newest';

    let results = [...mockTickets];

    if (search) {
      results = results.filter(t =>
        t.ticketNumber.toLowerCase().includes(search) ||
        t.subject.toLowerCase().includes(search) ||
        t.createdByName.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search)
      );
    }
    if (status) results = results.filter(t => t.status === status);
    if (priority) results = results.filter(t => t.priority === priority);
    if (issueType) results = results.filter(t => t.issueType === issueType);
    if (category) results = results.filter(t => t.category === category);
    if (assignedEngineerId) results = results.filter(t => t.assignedEngineerId === assignedEngineerId);

    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    switch (sortBy) {
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest_priority':
        results.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'recently_updated':
        results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return HttpResponse.json({ success: true, message: 'OK', data: results.map(withDepartment), total: results.length });
  }),

  // GET my tickets (employee)
  http.get('/api/tickets/my', ({ request }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) return HttpResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status') || '';
    const priority = url.searchParams.get('priority') || '';
    const category = url.searchParams.get('category') || '';

    let results = mockTickets.filter(t => t.createdById === userId);

    if (search) results = results.filter(t =>
      t.ticketNumber.toLowerCase().includes(search) ||
      t.subject.toLowerCase().includes(search) ||
      t.category.toLowerCase().includes(search)
    );
    if (status) results = results.filter(t => t.status === status);
    if (priority) results = results.filter(t => t.priority === priority);
    if (category) results = results.filter(t => t.category === category);

    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return HttpResponse.json({ success: true, message: 'OK', data: results.map(withDepartment), total: results.length });
  }),

  // GET ticket by ID
  http.get('/api/tickets/:id', ({ params }) => {
    const ticket = getTicketById(params.id as string);
    if (!ticket) {
      return HttpResponse.json({ success: false, message: 'Ticket not found.' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'OK', data: withDepartment(ticket) });
  }),

  // POST create ticket
  http.post('/api/tickets', async ({ request }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) return HttpResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json() as CreateTicketRequest & { createdByName: string; createdByEmail: string };

    await new Promise(r => setTimeout(r, 800));

    const now = new Date().toISOString();
    const ticketNumber = generateTicketNumber();
    const id = `ticket-${Date.now()}`;

    const activity: TicketActivity = {
      id: `act-${id}-1`,
      ticketId: id,
      action: 'Ticket Created',
      description: `${body.createdByName} submitted the ticket.`,
      performedBy: body.createdByName,
      performedById: userId,
      timestamp: now,
      type: 'created',
    };

    const newTicket: Ticket = {
      id,
      ticketNumber,
      subject: body.subject,
      description: body.description,
      issueType: body.issueType,
      category: body.category,
      priority: body.priority,
      status: 'Open',
      createdById: userId,
      createdByName: body.createdByName,
      createdByEmail: body.createdByEmail,
      attachmentName: body.attachmentName,
      createdAt: now,
      updatedAt: now,
      activities: [activity],
    };

    addTicket(newTicket);

    return HttpResponse.json({ success: true, message: 'Ticket created successfully.', data: withDepartment(newTicket) }, { status: 201 });
  }),

  // PATCH assign ticket
  http.patch('/api/tickets/:id/assign', async ({ params, request }) => {
    const body = await request.json() as AssignTicketRequest & { previousEngineerName?: string };
    await new Promise(r => setTimeout(r, 500));

    const ticket = getTicketById(params.id as string);
    if (!ticket) return HttpResponse.json({ success: false, message: 'Ticket not found.' }, { status: 404 });

    const activityDesc = body.previousEngineerName
      ? `Ticket reassigned from ${body.previousEngineerName} to ${body.engineerName}.`
      : `Ticket assigned to ${body.engineerName}.`;

    const actType = body.previousEngineerName ? 'reassigned' : 'assigned';
    const now = new Date().toISOString();

    const activity: TicketActivity = {
      id: `act-${Date.now()}`,
      ticketId: ticket.id,
      action: body.previousEngineerName ? 'Ticket Reassigned' : 'Ticket Assigned',
      description: activityDesc,
      performedBy: body.engineerName,
      performedById: body.engineerId,
      timestamp: now,
      type: actType,
    };

    const updated = updateTicket(params.id as string, {
      assignedEngineerId: body.engineerId,
      assignedEngineerName: body.engineerName,
      activities: [...ticket.activities, activity],
    });

    return HttpResponse.json({ success: true, message: 'Ticket assigned successfully.', data: updated ? withDepartment(updated) : updated });
  }),

  // PATCH update status
  http.patch('/api/tickets/:id/status', async ({ params, request }) => {
    const body = await request.json() as UpdateTicketStatusRequest & { performedBy: string; performedById: string };
    await new Promise(r => setTimeout(r, 500));

    const ticket = getTicketById(params.id as string);
    if (!ticket) return HttpResponse.json({ success: false, message: 'Ticket not found.' }, { status: 404 });

    const now = new Date().toISOString();
    let actDesc = `Status changed from ${ticket.status} to ${body.status}.`;
    let actType: TicketActivity['type'] = 'status_changed';

    if (body.status === 'Resolved') {
      actDesc = body.resolutionNote || 'Ticket resolved.';
      actType = 'resolved';
    }

    const activity: TicketActivity = {
      id: `act-${Date.now()}`,
      ticketId: ticket.id,
      action: body.status === 'Resolved' ? 'Ticket Resolved' : `Status Changed to ${body.status}`,
      description: actDesc,
      performedBy: body.performedBy,
      performedById: body.performedById,
      timestamp: now,
      type: actType,
    };

    const updates: Partial<Ticket> = {
      status: body.status,
      activities: [...ticket.activities, activity],
    };

    if (body.status === 'Resolved') {
      updates.resolvedAt = now;
      updates.resolutionNote = body.resolutionNote;
    }

    const updated = updateTicket(params.id as string, updates);
    return HttpResponse.json({ success: true, message: 'Status updated successfully.', data: updated ? withDepartment(updated) : updated });
  }),
];
