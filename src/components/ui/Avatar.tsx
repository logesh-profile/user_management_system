import { motion } from 'framer-motion';
import { cn, getInitials } from '../../utils/helpers';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

const gradients = [
  'from-primary-500 to-secondary-500',
  'from-accent-500 to-primary-500',
  'from-secondary-500 to-accent-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
];

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const gradientIndex = name
    ? name.charCodeAt(0) % gradients.length
    : 0;

  const initials = getInitials(name);

  if (src) {
    return (
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        src={src}
        alt={name}
        className={cn(
          sizes[size],
          'rounded-full object-cover ring-2 ring-white/10',
          className
        )}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        sizes[size],
        'rounded-full flex items-center justify-center font-semibold text-white',
        `bg-gradient-to-br ${gradients[gradientIndex]}`,
        'ring-2 ring-white/10',
        className
      )}
    >
      {initials}
    </motion.div>
  );
}
