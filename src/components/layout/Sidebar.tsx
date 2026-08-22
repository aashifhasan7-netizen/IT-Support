import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Ticket, PlusCircle, User, LogOut,
  Headphones, ClipboardList, BarChart3, X, ChevronRight,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const employeeNav: NavItem[] = [
  { label: 'Dashboard', to: '/employee/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
  { label: 'My Tickets', to: '/employee/tickets', icon: <Ticket className="w-4.5 h-4.5" /> },
  { label: 'Create Ticket', to: '/employee/tickets/create', icon: <PlusCircle className="w-4.5 h-4.5" /> },
  { label: 'Profile', to: '/employee/profile', icon: <User className="w-4.5 h-4.5" /> },
];

const supportNav: NavItem[] = [
  { label: 'Dashboard', to: '/support/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
  { label: 'Ticket Queue', to: '/support/tickets', icon: <Inbox className="w-4.5 h-4.5" /> },
  { label: 'My Assigned', to: '/support/assigned', icon: <ClipboardList className="w-4.5 h-4.5" /> },
  { label: 'Reports', to: '/support/reports', icon: <BarChart3 className="w-4.5 h-4.5" /> },
  { label: 'Profile', to: '/support/profile', icon: <User className="w-4.5 h-4.5" /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = user?.role === 'EMPLOYEE' ? employeeNav : supportNav;

  // Pick the single most specific nav item for the current path, so a page like
  // "/employee/tickets/create" (nested under "/employee/tickets") only lights up
  // its own "Create Ticket" entry instead of highlighting "My Tickets" as well.
  const activeTo = navItems
    .map(item => item.to)
    .filter(to => location.pathname === to || location.pathname.startsWith(`${to}/`))
    .sort((a, b) => b.length - a.length)[0];

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-950/50">
          <Headphones className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm leading-tight truncate">IT Helpdesk</p>
          <p className="text-slate-400 text-xs truncate">Support Portal</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto p-1 rounded text-slate-400 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role chip */}
      <div className="px-4 py-3">
        <span className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${user?.role === 'EMPLOYEE' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}
        `}>
          {user?.role === 'EMPLOYEE' ? 'Employee' : 'Support Engineer'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.to === activeTo;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-blue-500"
                  transition={{ duration: 0.2 }}
                />
              )}
              <span className={`flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`}>{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-red-400 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 h-screen sticky top-0 flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, #0f1129 0%, #14152e 100%)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 top-0 z-50 w-60 h-full flex flex-col lg:hidden"
              style={{ background: 'linear-gradient(180deg, #0f1129 0%, #14152e 100%)' }}
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(v => !v),
  };
}
