import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goHome = () => navigate(user?.role === 'EMPLOYEE' ? '/employee/dashboard' : '/support/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <p className="text-7xl font-black text-slate-200 mb-3">404</p>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 text-sm mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button leftIcon={<Home className="w-4 h-4" />} onClick={goHome}>
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
