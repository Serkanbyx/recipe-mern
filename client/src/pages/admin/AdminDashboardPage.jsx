import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  Heart,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import adminService from '../../services/adminService';
import Spinner from '../../components/ui/Spinner';

const STAT_CARDS = [
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: Users,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
  },
  {
    key: 'totalRecipes',
    label: 'Total Recipes',
    icon: BookOpen,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
  },
  {
    key: 'totalPublished',
    label: 'Published Recipes',
    icon: CheckCircle,
    color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/50',
  },
  {
    key: 'totalDrafts',
    label: 'Draft Recipes',
    icon: Clock,
    color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
  },
];

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const RoleBadge = ({ role }) => {
  const roleClass =
    role === 'admin'
      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full capitalize ${roleClass}`}>
      {role}
    </span>
  );
};

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminService.getDashboard();
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Something went wrong</h3>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  const {
    totalUsers,
    totalRecipes,
    totalPublished,
    totalDrafts,
    recipesByCategory,
    mostLikedRecipes,
    newestUsers,
    newestRecipes,
  } = data;

  const stats = { totalUsers, totalRecipes, totalPublished, totalDrafts };
  const maxCategoryCount = recipesByCategory.length
    ? Math.max(...recipesByCategory.map((c) => c.count))
    : 1;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your platform's statistics and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, iconBg }) => (
          <div
            key={key}
            className={`rounded-xl p-5 ${color} border border-transparent`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{label}</p>
                <p className="mt-1 text-3xl font-bold">{stats[key].toLocaleString()}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts / Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipes by Category */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recipes by Category
            </h2>
          </div>

          {recipesByCategory.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No category data yet.</p>
          ) : (
            <div className="space-y-3">
              {recipesByCategory.map((cat) => (
                <div key={cat._id} className="flex items-center gap-3">
                  <span className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300 truncate capitalize">
                    {cat._id}
                  </span>
                  <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 dark:bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Popular Recipes */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Most Popular Recipes
            </h2>
          </div>

          {mostLikedRecipes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No recipes yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {mostLikedRecipes.map((recipe, idx) => (
                <div key={recipe._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-400">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/recipes/${recipe.slug}`}
                      className="text-sm font-medium text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 truncate block transition-colors"
                    >
                      {recipe.title}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      by {recipe.author?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-red-500 dark:text-red-400 font-medium">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {recipe.likes?.length ?? recipe.likes ?? 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Newest Users */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Newest Users</h2>
            </div>
            <Link
              to="/admin/users"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
            >
              View all
            </Link>
          </div>

          {newestUsers.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No users yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {newestUsers.map((user) => (
                <div key={user._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <RoleBadge role={user.role} />
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newest Recipes */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Newest Recipes</h2>
            </div>
            <Link
              to="/admin/recipes"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
            >
              View all
            </Link>
          </div>

          {newestRecipes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No recipes yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {newestRecipes.map((recipe) => (
                <div key={recipe._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/recipes/${recipe.slug}`}
                      className="text-sm font-medium text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 truncate block transition-colors"
                    >
                      {recipe.title}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {recipe.author?.name || 'Unknown'} · <span className="capitalize">{recipe.category}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                    {formatDate(recipe.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
