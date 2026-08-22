import { http, HttpResponse } from 'msw';
import { mockUsers, supportEngineers } from '../data/users';

export const userHandlers = [
  http.get('/api/users', () => {
    return HttpResponse.json({ success: true, message: 'OK', data: mockUsers });
  }),

  http.get('/api/users/engineers', () => {
    return HttpResponse.json({ success: true, message: 'OK', data: supportEngineers });
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id);
    if (!user) return HttpResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    return HttpResponse.json({ success: true, message: 'OK', data: user });
  }),
];
