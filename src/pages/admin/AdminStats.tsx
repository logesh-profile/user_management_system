import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchStats } from '../../redux/slices/userSlice';
import { StatCard } from '../../components/common/StatCard';
import { Users, Shield, UserCheck, UserX, TrendingUp, Activity } from 'lucide-react';

export function AdminStats() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats?.total || 0, color: 'primary' as const },
    { icon: UserCheck, label: 'Active Users', value: stats?.active || 0, color: 'success' as const },
    { icon: Shield, label: 'Admins', value: stats?.admins || 0, color: 'secondary' as const },
    { icon: UserX, label: 'Blocked Users', value: stats?.blocked || 0, color: 'danger' as const },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Statistics</h1>
        <p className="text-dark-400">Platform overview and metrics</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass p-6 animate-pulse">
              <div className="h-40 bg-dark-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary-500/20">
                <TrendingUp className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">User Distribution</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-400">Active Users</span>
                  <span className="text-white">{stats?.active || 0}</span>
                </div>
                <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((stats?.active || 0) / (stats?.total || 1)) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-400">Admins</span>
                  <span className="text-white">{stats?.admins || 0}</span>
                </div>
                <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((stats?.admins || 0) / (stats?.total || 1)) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-secondary-500 to-secondary-400"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-400">Blocked</span>
                  <span className="text-white">{stats?.blocked || 0}</span>
                </div>
                <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((stats?.blocked || 0) / (stats?.total || 1)) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-red-500 to-red-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-accent-500/20">
                <Activity className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50">
                <span className="text-dark-300">Total Registered</span>
                <span className="text-2xl font-bold text-white">{stats?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50">
                <span className="text-dark-300">Active Rate</span>
                <span className="text-2xl font-bold text-emerald-400">
                  {stats?.total ? Math.round(((stats.active || 0) / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50">
                <span className="text-dark-300">Admin Ratio</span>
                <span className="text-2xl font-bold text-secondary-400">
                  {stats?.total ? Math.round(((stats.admins || 0) / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
