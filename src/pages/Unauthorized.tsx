import { motion } from 'framer-motion';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goHome = () => navigate(user?.role === 'EMPLOYEE' ? '/employee/dashboard' : '/support/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-sm"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldOff className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h1>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          You do not have permission to access this page.
          This area is restricted to authorized roles only.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={goHome}>
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
