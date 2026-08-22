import { motion } from 'framer-motion';
import { User, Mail, Building2, BadgeCheck, Shield, CreditCard } from 'lucide-react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { useAuth } from '../../../context/AuthContext';

export default function EmployeeProfile() {
  const { user } = useAuth();

  const fields = [
    { label: 'Full Name', value: user?.name, icon: User },
    { label: 'Email Address', value: user?.email, icon: Mail },
    { label: 'Role', value: 'Employee', icon: Shield },
    { label: 'Department', value: user?.department, icon: Building2 },
    { label: 'Employee ID', value: user?.employeeId, icon: CreditCard },
    { label: 'Account Status', value: user?.status, icon: BadgeCheck },
  ];

  return (
    <AppLayout title="My Profile" breadcrumb="Employee">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-blue-200 text-sm">{user?.email}</p>
                <span className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  Employee
                </span>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(field => (
                <div key={field.label} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200">
                    <field.icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium mb-0.5">{field.label}</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {field.value || '—'}
                      {field.label === 'Account Status' && (
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          ● Active
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
