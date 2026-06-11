import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchStats } from '../../redux/slices/userSlice';
import { StatCard } from '../../components/common/StatCard';
import { Users, Shield, UserCheck, UserX } from 'lucide-react';

export function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.users);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-dark-400">
          Welcome back, {user?.fullname}. Here's the system overview.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass p-6 animate-pulse">
              <div className="h-20 bg-dark-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats?.total || 0}
              color="primary"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCard
              icon={UserCheck}
              label="Active Users"
              value={stats?.active || 0}
              color="success"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCard
              icon={Shield}
              label="Admins"
              value={stats?.admins || 0}
              color="secondary"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatCard
              icon={UserX}
              label="Blocked Users"
              value={stats?.blocked || 0}
              color="danger"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
