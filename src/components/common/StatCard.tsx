import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'danger';
}

const colorVariants = {
  primary: 'from-primary-500/20 to-primary-600/20 border-primary-500/30',
  secondary: 'from-secondary-500/20 to-secondary-600/20 border-secondary-500/30',
  accent: 'from-accent-500/20 to-accent-600/20 border-accent-500/30',
  success: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
  danger: 'from-red-500/20 to-red-600/20 border-red-500/30',
};

const iconColors = {
  primary: 'bg-primary-500/20 text-primary-400',
  secondary: 'bg-secondary-500/20 text-secondary-400',
  accent: 'bg-accent-500/20 text-accent-400',
  success: 'bg-emerald-500/20 text-emerald-400',
  danger: 'bg-red-500/20 text-red-400',
};

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'glass p-6 bg-gradient-to-br border',
        colorVariants[color]
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn('p-3 rounded-xl', iconColors[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-dark-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
