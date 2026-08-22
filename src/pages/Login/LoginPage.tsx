import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Headphones, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

const demoAccounts = [
  { label: 'Employee Demo', email: 'employee@demo.com', password: 'employee123', color: 'blue' },
  { label: 'Support Engineer Demo', email: 'support@demo.com', password: 'support123', color: 'purple' },
];

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Already signed in (e.g. a valid session restored on refresh) — send them
  // straight to their dashboard instead of showing the login form again.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'SUPPORT_ENGINEER' ? '/support/dashboard' : '/employee/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: LoginForm) => {
    setServerError('');
    try {
      const loggedInUser = await login({ email: data.email, password: data.password });
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      navigate(loggedInUser.role === 'SUPPORT_ENGINEER' ? '/support/dashboard' : '/employee/dashboard');
    } catch {
      setServerError('Invalid email or password. Please try again.');
    }
  };

  const fillDemo = (account: typeof demoAccounts[0]) => {
    setValue('email', account.email);
    setValue('password', account.password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] p-10 flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0f1129 0%, #1a1c3d 60%, #14152e 100%)' }}
      >
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-950/50">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">IT Helpdesk</p>
              <p className="text-slate-400 text-xs">Support Portal</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
            Resolve IT issues faster, together.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            A unified platform for employees to submit IT tickets and support engineers to track, assign, and resolve issues efficiently.
          </p>
        </div>
        <div className="relative space-y-3">
          {[
            { label: 'Ticket Tracking', desc: 'Real-time status updates' },
            { label: 'Priority Management', desc: 'Critical issues handled first' },
            { label: 'Role-Based Access', desc: 'Secure, permission-aware views' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">IT Helpdesk Portal</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h1>
            <p className="text-slate-500 text-sm">Enter your credentials to access the portal.</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6 grid grid-cols-2 gap-2">
            {demoAccounts.map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc)}
                className={`
                  text-left p-3 rounded-xl border-2 transition-all duration-150 text-xs
                  ${acc.color === 'blue'
                    ? 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
                    : 'border-purple-200 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'}
                `}
              >
                <p className={`font-semibold mb-0.5 ${acc.color === 'blue' ? 'text-blue-700' : 'text-purple-700'}`}>
                  {acc.label}
                </p>
                <p className="text-slate-500 truncate">{acc.email}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{serverError}</p>
              </motion.div>
            )}

            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              autoComplete="email"
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              autoComplete="current-password"
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  {...register('rememberMe')}
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full justify-center"
              size="lg"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            IT Support Portal — Internal Use Only
          </p>
        </motion.div>
      </div>
    </div>
  );
}
