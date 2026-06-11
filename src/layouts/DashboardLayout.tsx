import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar />

      <main className="flex-1 ml-64 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1 }}
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-500/30 to-secondary-500/30 blur-3xl"
          />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-accent-500/20 to-primary-500/20 blur-3xl" />
        </div>

        <div className="relative z-10 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
