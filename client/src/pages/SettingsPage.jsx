import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Camera,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import usePreferences from '../hooks/usePreferences';
import authService from '../services/authService';
import recipeService from '../services/recipeService';
import CharacterCounter from '../components/ui/CharacterCounter';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import SelectableCard from '../components/ui/SelectableCard';

const BIO_MAX_LENGTH = 300;

/* ─────────────── Profile Settings ─────────────── */

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatarPreview(user.avatar || '');
      setAvatarUrl(user.avatar || '');
    }
  }, [user]);

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB.');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await recipeService.uploadImage(formData);
      setAvatarUrl(data.data.url);
      toast.success('Avatar uploaded!');
    } catch (error) {
      setAvatarPreview(avatarUrl);
      toast.error(error.response?.data?.message || 'Failed to upload avatar.');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Name is required.');
      return;
    }

    if (bio.length > BIO_MAX_LENGTH) {
      toast.error(`Bio must be ${BIO_MAX_LENGTH} characters or less.`);
      return;
    }

    try {
      setSaving(true);
      const { data } = await authService.updateProfile({
        name: trimmedName,
        bio: bio.trim(),
        avatar: avatarUrl,
      });
      updateUser(data.data.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <form onSubmit={handleSaveProfile} className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Profile
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your public profile information.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100 dark:ring-gray-700">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                {userInitial}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Change avatar"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarSelect}
            className="hidden"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Photo
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            JPG, PNG or GIF. Max 5MB.
          </p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="settings-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Name
        </label>
        <input
          id="settings-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
          placeholder="Your name"
          required
        />
      </div>

      {/* Bio */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="settings-bio"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Bio
          </label>
          <CharacterCounter current={bio.length} max={BIO_MAX_LENGTH} />
        </div>
        <textarea
          id="settings-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={BIO_MAX_LENGTH}
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors resize-none"
          placeholder="Tell us a little about yourself..."
        />
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
};

/* ─────────────── Account Settings ─────────────── */

const PasswordInput = ({ id, label, value, onChange, placeholder }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
          required
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [password, setPassword] = useState('');
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      setPassword('');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    onConfirm(password);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h2
            id="delete-modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Delete Account
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This action is <strong>permanent</strong> and cannot be undone. Please
          enter your password to confirm.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="delete-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Password
            </label>
            <input
              ref={inputRef}
              id="delete-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete My Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      setChangingPassword(true);
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      setDeletingAccount(true);
      await authService.deleteAccount({ password });
      setShowDeleteModal(false);
      toast.success('Account deleted successfully.');
      logout();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account.');
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Account
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account security and settings.
        </p>
      </div>

      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="space-y-5">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Change Password
        </h3>

        <PasswordInput
          id="current-password"
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
        />

        <PasswordInput
          id="new-password"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />

        <PasswordInput
          id="confirm-password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
            Change Password
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="border border-red-200 dark:border-red-900/50 rounded-2xl p-6 bg-red-50/50 dark:bg-red-950/20">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-medium text-red-700 dark:text-red-400">
            Danger Zone
          </h3>
        </div>
        <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
          This action is permanent and cannot be undone. All your recipes and
          data will be deleted.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
        >
          Delete My Account
        </button>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={deletingAccount}
      />
    </div>
  );
};

/* ─────────────── Appearance Settings ─────────────── */

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' },
];

const FONT_SIZE_PREVIEW = {
  small: '14px',
  medium: '16px',
  large: '18px',
};

const AppearanceSettings = () => {
  const { theme, fontSize, contentDensity, animations, updatePreference } =
    usePreferences();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Appearance
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customize how the app looks and feels.
        </p>
      </div>

      {/* Theme */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Theme
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => (
            <SelectableCard
              key={option.value}
              selected={theme === option.value}
              onClick={() => updatePreference('theme', option.value)}
              icon={option.icon}
              label={option.label}
            />
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Font Size
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {FONT_SIZE_OPTIONS.map((option) => (
            <SelectableCard
              key={option.value}
              selected={fontSize === option.value}
              onClick={() => updatePreference('fontSize', option.value)}
              label={option.label}
            />
          ))}
        </div>
        <p
          className="text-gray-500 dark:text-gray-400 mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          style={{ fontSize: FONT_SIZE_PREVIEW[fontSize] }}
        >
          This is a preview of your selected font size.
        </p>
      </div>

      {/* Content Density */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Content Density
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {DENSITY_OPTIONS.map((option) => (
            <SelectableCard
              key={option.value}
              selected={contentDensity === option.value}
              onClick={() => updatePreference('contentDensity', option.value)}
              label={option.label}
            />
          ))}
        </div>
      </div>

      {/* Animations */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Motion
        </h3>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <ToggleSwitch
            checked={animations}
            onChange={(val) => updatePreference('animations', val)}
            label="Enable animations"
            description="Toggle transitions and animations throughout the app."
          />
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Privacy Settings ─────────────── */

const PrivacySettings = () => {
  const { user, updateUser } = useAuth();

  const showEmail = user?.preferences?.privacy?.showEmail ?? false;
  const showFavorites = user?.preferences?.privacy?.showFavorites ?? true;

  const handlePrivacyChange = async (key, value) => {
    try {
      const { data } = await authService.updatePreferences({
        privacy: { [key]: value },
      });

      updateUser({
        ...user,
        preferences: data.data.preferences,
      });

      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update privacy settings.'
      );
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Privacy
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Control what others can see on your public profile.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <ToggleSwitch
            checked={showEmail}
            onChange={(val) => handlePrivacyChange('showEmail', val)}
            label="Show email on profile"
            description="Allow other users to see your email address on your public profile."
          />
        </div>

        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <ToggleSwitch
            checked={showFavorites}
            onChange={(val) => handlePrivacyChange('showFavorites', val)}
            label="Show favorites on profile"
            description="Allow other users to see your favorite recipes on your public profile."
          />
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Settings Page ─────────────── */

const SettingsPage = ({ tab = 'profile' }) => {
  const sections = {
    profile: ProfileSettings,
    account: AccountSettings,
    appearance: AppearanceSettings,
    privacy: PrivacySettings,
  };

  const ActiveSection = sections[tab];

  if (!ActiveSection) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium">
          {tab.charAt(0).toUpperCase() + tab.slice(1)} settings coming soon.
        </p>
      </div>
    );
  }

  return <ActiveSection />;
};

export default SettingsPage;
