import { useState, useEffect, useCallback } from 'react';
import { Search, X, Trash2, AlertTriangle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import adminService from '../../services/adminService';
import useDebounce from '../../hooks/useDebounce';
import RoleBadge from '../../components/ui/RoleBadge';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatDate';

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  // Modal state
  const [modal, setModal] = useState({ isOpen: false, type: null, target: null });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (roleFilter) params.role = roleFilter;

      const { data } = await adminService.getUsers(params);
      setUsers(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    setModal({
      isOpen: true,
      type: 'role',
      target: { id: userId, role: newRole },
    });
  };

  const confirmRoleChange = async () => {
    const { id, role } = modal.target;
    try {
      await adminService.updateUserRole(id, role);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );
      toast.success('User role updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = (userId, userName) => {
    setModal({
      isOpen: true,
      type: 'delete',
      target: { id: userId, name: userName },
    });
  };

  const confirmDelete = async () => {
    const { id } = modal.target;
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const closeModal = () => setModal({ isOpen: false, type: null, target: null });

  const isSelf = (userId) => currentUser?._id === userId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Search, filter, and manage user accounts and roles.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <Spinner />}

      {/* Users Table */}
      {!loading && !error && users.length === 0 && (
        <EmptyState
          icon={Users}
          title="No users found"
          message="Try adjusting your search or filter criteria."
        />
      )}

      {!loading && users.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Role</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Recipes</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    {/* Avatar + Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff`}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {user.name}
                            {isSelf(user._id) && (
                              <span className="ml-1.5 text-xs text-primary-500">(You)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate md:hidden">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      <span className="truncate block max-w-[200px]">{user.email}</span>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      {isSelf(user._id) ? (
                        <RoleBadge role={user.role} />
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="text-xs font-medium px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer transition-colors"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>

                    {/* Recipe Count */}
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {user.recipeCount ?? 0}
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        disabled={isSelf(user._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title={isSelf(user._id) ? 'Cannot delete yourself' : `Delete ${user.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Role Change Modal */}
      <ConfirmModal
        isOpen={modal.isOpen && modal.type === 'role'}
        onClose={closeModal}
        onConfirm={confirmRoleChange}
        title="Change User Role"
        message={`Are you sure you want to change this user's role to "${modal.target?.role}"? This will modify their access permissions.`}
        confirmText="Change Role"
        confirmColor="blue"
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={modal.isOpen && modal.type === 'delete'}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${modal.target?.name}"? This action cannot be undone and all their data will be permanently removed.`}
        confirmText="Delete User"
        confirmColor="red"
      />
    </div>
  );
};

export default AdminUsersPage;
