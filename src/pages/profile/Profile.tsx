import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Upload,
  Trash2,
  X,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { changePassword, deleteAccount, updateProfile } from '../../api/userApi';
import axiosInstance from '../../api/axiosInstance';

const profileSchema = yup.object({
  fullname: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, 'Must contain uppercase, lowercase, and number')
    .required('New password is required'),
});

const deleteSchema = yup.object({
  password: yup.string().required('Password is required to confirm deletion'),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
type PasswordFormData = yup.InferType<typeof passwordSchema>;
type DeleteFormData = yup.InferType<typeof deleteSchema>;

export function Profile() {
  const { user, refreshUser, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>('profile');

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: { fullname: user?.fullname || '' },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const {
    register: registerDelete,
    handleSubmit: handleDeleteSubmit,
    formState: { errors: deleteErrors },
    reset: resetDelete,
  } = useForm<DeleteFormData>({
    resolver: yupResolver(deleteSchema),
  });

  useEffect(() => {
    if (user) {
      resetProfile({ fullname: user.fullname });
    }
  }, [user, resetProfile]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('fullname', data.fullname);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      await updateProfile(formData);
      refreshUser();
      toast.success('Profile updated successfully');
      setPreview(null);
      setAvatarFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setLoading(true);
      await changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteSubmit = async (data: DeleteFormData) => {
    try {
      setLoading(true);
      await deleteAccount();
      toast.success('Account deleted successfully');
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-dark-400">Manage your account settings and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="glass p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500/20 text-white'
                    : 'text-dark-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          {activeTab === 'profile' && (
            <div className="glass p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-400" />
                Edit Profile
              </h2>

              {/* Avatar Upload */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Avatar preview"
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-500/30"
                      />
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Avatar
                      src={user.profileImage}
                      name={user.fullname}
                      size="xl"
                    />
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-dark-500 mt-2">
                    JPEG, PNG or WebP. Max 5MB.
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  icon={User}
                  placeholder="Your name"
                  error={profileErrors.fullname?.message}
                  {...registerProfile('fullname')}
                />

                <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-700/50 border border-dark-600">
                  <Mail className="w-5 h-5 text-dark-400" />
                  <div>
                    <p className="text-xs text-dark-400">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>

                <Button type="submit" loading={loading} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="glass p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary-400" />
                Change Password
              </h2>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                <Input
                  label="Current Password"
                  type="password"
                  error={passwordErrors.currentPassword?.message}
                  {...registerPassword('currentPassword')}
                />

                <Input
                  label="New Password"
                  type="password"
                  error={passwordErrors.newPassword?.message}
                  {...registerPassword('newPassword')}
                />

                <Button type="submit" loading={loading}>
                  Update Password
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="glass p-6 border-red-500/30">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Danger Zone
              </h2>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-6">
                <h3 className="text-white font-medium mb-2">Delete Account</h3>
                <p className="text-dark-300 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="danger" onClick={() => setDeleteModal(true)}>
                  Delete My Account
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account">
        <form onSubmit={handleDeleteSubmit(onDeleteSubmit)} className="space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-4">
            <p className="text-dark-300">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
          <Input
            label="Confirm your password"
            type="password"
            error={deleteErrors.password?.message}
            {...registerDelete('password')}
          />
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setDeleteModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" type="submit" loading={loading} className="flex-1">
              Delete Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
