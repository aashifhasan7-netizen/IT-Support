import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const EmployeeDashboard = lazy(() => import('./pages/Employee/Dashboard/EmployeeDashboard'));
const MyTickets = lazy(() => import('./pages/Employee/Tickets/MyTickets'));
const CreateTicketPage = lazy(() => import('./pages/Employee/CreateTicket/CreateTicketPage'));
const EmployeeTicketDetails = lazy(() => import('./pages/Employee/Tickets/TicketDetails'));
const EmployeeProfile = lazy(() => import('./pages/Employee/Profile/EmployeeProfile'));
const SupportDashboard = lazy(() => import('./pages/Support/Dashboard/SupportDashboard'));
const TicketQueue = lazy(() => import('./pages/Support/TicketQueue/TicketQueue'));
const SupportTicketDetails = lazy(() => import('./pages/Support/TicketDetails/SupportTicketDetails'));
const AssignedTickets = lazy(() => import('./pages/Support/AssignedTickets/AssignedTickets'));
const ReportsPage = lazy(() => import('./pages/Support/Reports/ReportsPage'));
const SupportProfile = lazy(() => import('./pages/Support/Profile/SupportProfile'));
const UnauthorizedPage = lazy(() => import('./pages/Unauthorized'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Employee routes */}
              <Route path="/employee/*" element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="EMPLOYEE">
                    <Routes>
                      <Route path="dashboard" element={<EmployeeDashboard />} />
                      <Route path="tickets" element={<MyTickets />} />
                      <Route path="tickets/create" element={<CreateTicketPage />} />
                      <Route path="tickets/:id" element={<EmployeeTicketDetails />} />
                      <Route path="profile" element={<EmployeeProfile />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </RoleRoute>
                </ProtectedRoute>
              } />

              {/* Support Engineer routes */}
              <Route path="/support/*" element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="SUPPORT_ENGINEER">
                    <Routes>
                      <Route path="dashboard" element={<SupportDashboard />} />
                      <Route path="tickets" element={<TicketQueue />} />
                      <Route path="tickets/:id" element={<SupportTicketDetails />} />
                      <Route path="assigned" element={<AssignedTickets />} />
                      <Route path="reports" element={<ReportsPage />} />
                      <Route path="profile" element={<SupportProfile />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </RoleRoute>
                </ProtectedRoute>
              } />

              {/* Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              fontSize: '14px',
              borderRadius: '10px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#f1f5f9' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
