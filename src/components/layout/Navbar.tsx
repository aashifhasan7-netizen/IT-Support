import { Menu, ChevronDown, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { NotificationsDropdown } from './NotificationsDropdown';
import { GlobalSearch } from './GlobalSearch';
import toast from 'react-hot-toast';

interface NavbarProps {
  onMenuClick: () => void;
  title: string;
  breadcrumb?: string;
}

export function Navbar({ onMenuClick, title, breadcrumb }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate(user?.role === 'EMPLOYEE' ? '/employee/profile' : '/support/profile');
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="min-w-0">
        {breadcrumb && (
          <p className="text-xs text-slate-400 leading-none mb-0.5">{breadcrumb}</p>
        )}
        <h1 className="text-base font-semibold text-slate-900 truncate">{title}</h1>
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center px-2">
        <GlobalSearch />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <NotificationsDropdown />

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500 leading-tight">
                {user?.role === 'EMPLOYEE' ? 'Employee' : 'Support Engineer'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50"
              >
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
