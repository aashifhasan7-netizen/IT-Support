import { http, HttpResponse } from 'msw';
import { mockUsers, mockPasswords } from '../data/users';
import type { User } from '../../types/auth';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    const { email, password } = body;

    await new Promise(r => setTimeout(r, 600));

    const user = mockUsers.find(u => u.email === email);
    const validPassword = mockPasswords[email];

    if (!user || validPassword !== password) {
      return HttpResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = btoa(`${user.id}:${Date.now()}`);
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

    return HttpResponse.json({
      success: true,
      message: 'Login successful.',
      data: { user, token, expiresAt },
    });
  }),

  http.post('/api/auth/logout', async () => {
    await new Promise(r => setTimeout(r, 200));
    return HttpResponse.json({ success: true, message: 'Logged out successfully.' });
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = atob(token);
      const userId = decoded.split(':')[0];
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return HttpResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
      }
      return HttpResponse.json({ success: true, message: 'OK', data: user as User });
    } catch {
      return HttpResponse.json({ success: false, message: 'Invalid token.' }, { status: 401 });
    }
  }),
];
