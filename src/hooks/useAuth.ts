import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { fetchCurrentUser, logoutUser, clearError } from '../redux/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, loading, initializing, error } = useSelector(
    (state: RootState) => state.auth
  );

  const isAdmin = user?.role === 'admin';
  const isBlocked = user?.isBlocked ?? false;

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const refreshUser = useCallback(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [token, dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isBlocked,
    loading,
    initializing,
    error,
    logout,
    clearAuthError,
    refreshUser,
  };
}
