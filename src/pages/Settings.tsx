import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from '../components/ui/Avatar';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

export function Settings() {
  const { user } = useAuth();

  const settingsSections = [
    { icon: User, label: 'Profile', description: 'Update your profile information and avatar', href: '/profile' },
    { icon: Shield, label: 'Security', description: 'Manage passwords and account security', href: '/profile' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-400">Manage your account preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link to={section.href} className="block">
              <div className="glass p-6 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary-500/20">
                    <section.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{section.label}</h3>
                    <p className="text-sm text-dark-400">{section.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
