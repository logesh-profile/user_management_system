import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  fetchUsers,
  deleteUserThunk,
  updateUserThunk,
} from '../../redux/slices/userSlice';
import { toast } from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { formatDate, debounce } from '../../utils/helpers';
import type { User } from '../../types';

export function UserList() {
  const dispatch = useAppDispatch();
  const { users, pagination, loading } = useAppSelector((state) => state.users);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    isBlocked: false,
  });

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const debouncedSearch = debounce((value: string) => {
    dispatch(fetchUsers({ page: 1, limit: 10, search: value, role: roleFilter }));
  }, 300);

  const handleSearch = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    dispatch(fetchUsers({ page: 1, limit: 10, search, role }));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchUsers({ page, limit: 10, search, role: roleFilter }));
  };

  const openEditModal = (user: User) => {
    setEditForm({
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
    });
    setEditModal({ open: true, user });
  };

  const openDeleteModal = (user: User) => {
    setDeleteModal({ open: true, user });
  };

  const handleEdit = async () => {
    if (!editModal.user) return;
    try {
      await dispatch(
        updateUserThunk({ id: editModal.user.id, data: editForm })
      ).unwrap();
      toast.success('User updated successfully');
      setEditModal({ open: false, user: null });
      dispatch(fetchUsers({ page: pagination.page, limit: 10, search, role: roleFilter }));
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    try {
      await dispatch(deleteUserThunk(deleteModal.user.id)).unwrap();
      toast.success('User deleted successfully');
      setDeleteModal({ open: false, user: null });
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-dark-400">Manage all registered users</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-4 mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleRoleFilter('')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              roleFilter === ''
                ? 'bg-primary-500 text-white'
                : 'bg-dark-700 text-dark-300 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleRoleFilter('user')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              roleFilter === 'user'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-700 text-dark-300 hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => handleRoleFilter('admin')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              roleFilter === 'admin'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-700 text-dark-300 hover:text-white'
            }`}
          >
            Admins
          </button>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-dark-400 font-medium">User</th>
                <th className="text-left p-4 text-dark-400 font-medium">Email</th>
                <th className="text-left p-4 text-dark-400 font-medium">Role</th>
                <th className="text-left p-4 text-dark-400 font-medium">Status</th>
                <th className="text-left p-4 text-dark-400 font-medium">Created</th>
                <th className="text-left p-4 text-dark-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-dark-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.profileImage}
                          name={user.fullname}
                          size="sm"
                        />
                        <span className="text-white font-medium">
                          {user.fullname}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-dark-300">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`badge ${
                          user.role === 'admin' ? 'badge-purple' : 'badge-blue'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`badge ${
                          user.isBlocked ? 'badge-red' : 'badge-green'
                        }`}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-dark-400 text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg hover:bg-primary-500/20 text-primary-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-dark-400 text-sm">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <span className="text-white px-4">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        title="Edit User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={editForm.fullname}
              onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Role
            </label>
            <select
              value={editForm.role}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  role: e.target.value as 'user' | 'admin',
                })
              }
              className="input-field"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isBlocked"
              checked={editForm.isBlocked}
              onChange={(e) =>
                setEditForm({ ...editForm, isBlocked: e.target.checked })
              }
              className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="isBlocked" className="text-dark-300">
              Block this user
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setEditModal({ open: false, user: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-dark-300">
            Are you sure you want to delete{' '}
            <span className="text-white font-medium">
              {deleteModal.user?.fullname}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, user: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
