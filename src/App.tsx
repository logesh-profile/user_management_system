import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'react-hot-toast';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Route Guards
import { ProtectedRoute, AdminRoute, GuestRoute } from './routes';

// Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { UserDashboard } from './pages/dashboard/UserDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { UserList } from './pages/admin/UserList';
import { AdminStats } from './pages/admin/AdminStats';
import { Profile } from './pages/profile/Profile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

// Hooks
import { useAuth } from './hooks/useAuth';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

function AppRoutes() {
  const { initializing, isAuthenticated, isAdmin } = useAuth();

  if (initializing) {
    return <LoadingSpinner fullScreen />;
  }

  // Determine which dashboard to show based on user role
  const DashboardComponent = isAdmin ? AdminDashboard : UserDashboard;

  return (
    <Routes>
      {/* Public Routes (Guest Only) */}
      <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes (Authenticated Users) */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardComponent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/stats" element={<AdminStats />} />
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
