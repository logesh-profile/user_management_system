import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../../components/ui/Avatar';
import { formatDate } from '../../utils/helpers';
import { Calendar, Mail, Shield, Clock, UserCircle } from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="gradient-text">{user.fullname.split(' ')[0]}</span>!
        </h1>
        <p className="text-dark-400">Here's your account overview</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 text-center"
        >
          <Avatar
            src={user.profileImage}
            name={user.fullname}
            size="2xl"
            className="mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-white">{user.fullname}</h2>
          <p className="text-dark-400 mb-4">{user.email}</p>
          <span
            className={`badge ${
              user.role === 'admin' ? 'badge-purple' : 'badge-blue'
            }`}
          >
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-primary-400" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-dark-400">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-secondary-400" />
                </div>
                <div>
                  <p className="text-xs text-dark-400">Role</p>
                  <p className="text-white font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-xs text-dark-400">Created</p>
                  <p className="text-white font-medium">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-dark-400">Last Login</p>
                  <p className="text-white font-medium">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 lg:col-span-3"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
          <div className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full ${
                user.isBlocked ? 'bg-red-500' : 'bg-emerald-500'
              } animate-pulse`}
            />
            <span
              className={`text-lg font-medium ${
                user.isBlocked ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {user.isBlocked ? 'Account Blocked' : 'Account Active'}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
