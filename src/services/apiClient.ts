import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem('helpdesk_session');
    if (session) {
      try {
        const { token } = JSON.parse(session);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // malformed session, ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle common errors.
// A 401 from the login endpoint itself just means "wrong credentials" and must
// be left to the caller (LoginPage) to display inline — it is not an expired
// session, so it should never force a hard redirect/reload of the SPA.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('helpdesk_session');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
