import { useState, useEffect, useCallback } from 'react';
import { Search, X, Trash2, ExternalLink, AlertTriangle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import useDebounce from '../../hooks/useDebounce';
import { CATEGORIES, DIFFICULTIES } from '../../utils/constants';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatDate';

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const DifficultyBadge = ({ difficulty }) => {
  const colorClass = DIFFICULTY_COLORS[difficulty] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${colorClass}`}>
      {difficulty}
    </span>
  );
};

const AdminRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, target: null });

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      if (status) params.status = status;
      if (difficulty) params.difficulty = difficulty;

      const { data } = await adminService.getRecipes(params);
      setRecipes(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, status, difficulty]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, status, difficulty]);

  const handleDelete = (recipeId, recipeTitle) => {
    setDeleteModal({ isOpen: true, target: { id: recipeId, title: recipeTitle } });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal.target;
    try {
      await adminService.deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      toast.success('Recipe deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete recipe');
    }
  };

  const closeModal = () => setDeleteModal({ isOpen: false, target: null });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Recipes</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Browse, filter, and manage all recipes on the platform.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
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

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
          >
            <option value="">All Difficulties</option>
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff.toLowerCase()}>{diff}</option>
            ))}
          </select>
        </div>
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

      {/* Empty State */}
      {!loading && !error && recipes.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No recipes found"
          message="Try adjusting your search or filter criteria."
        />
      )}

      {/* Recipes Table */}
      {!loading && recipes.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Recipe</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Author</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Difficulty</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden xl:table-cell">Likes</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden xl:table-cell">Created</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recipes.map((recipe) => (
                  <tr key={recipe._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    {/* Image + Title */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
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
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                            {recipe.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 md:hidden truncate">
                            {recipe.author?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      <span className="truncate block max-w-[150px]">{recipe.author?.name || 'Unknown'}</span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize hidden lg:table-cell">
                      {recipe.category}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={recipe.status} />
                    </td>

                    {/* Difficulty */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <DifficultyBadge difficulty={recipe.difficulty} />
                    </td>

                    {/* Likes */}
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 hidden xl:table-cell">
                      {recipe.likes?.length ?? recipe.likes ?? 0}
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden xl:table-cell whitespace-nowrap">
                      {formatDate(recipe.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/recipes/${recipe.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="View recipe"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </a>
                        <button
                          onClick={() => handleDelete(recipe._id, recipe.title)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title={`Delete ${recipe.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
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

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${deleteModal.target?.title}"? This action cannot be undone.`}
        confirmText="Delete Recipe"
        confirmColor="red"
      />
    </div>
  );
};

export default AdminRecipesPage;
