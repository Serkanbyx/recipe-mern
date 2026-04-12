import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import recipeService from '../services/recipeService';
import { getErrorMessage } from '../utils/helpers';
import RecipeCard from '../components/recipe/RecipeCard';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import { RecipeGridSkeleton } from '../components/ui/RecipeCardSkeleton';

const LIMIT = 12;

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Draft' },
];

const MyRecipesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const updateParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (!value || (key === 'page' && value === '1')) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });

        return next;
      });
    },
    [setSearchParams]
  );

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (status) params.status = status;

      const { data } = await recipeService.getMyRecipes(params);
      setRecipes(data?.data?.recipes || []);
      setTotal(data?.data?.total || 0);
      setTotalPages(data?.data?.totalPages || 1);
    } catch {
      setRecipes([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleTabChange = useCallback(
    (tabKey) => {
      updateParams({ status: tabKey, page: '1' });
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      updateParams({ page: String(newPage) });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateParams]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await recipeService.delete(deleteTarget);
      setRecipes((prev) => prev.filter((r) => r._id !== deleteTarget));
      setTotal((prev) => prev - 1);
      toast.success('Recipe deleted successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
      await fetchRecipes();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, fetchRecipes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Recipes</h1>
          {!loading && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
              {' '}recipe{total !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <Link
          to="/recipes/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-400 hover:bg-primary-500 rounded-xl shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Recipe
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-px">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative ${
              status === tab.key
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
            {status === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <RecipeGridSkeleton />
      ) : recipes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No recipes"
          message="You haven't created any recipes yet. Start by sharing your first recipe!"
          action={{ to: '/recipes/new', label: 'Create Recipe', icon: PlusCircle }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="relative group">
              <RecipeCard recipe={recipe} />

              {/* Status Badge Overlay */}
              <div className="absolute top-10 left-3 z-10">
                <StatusBadge status={recipe.status} />
              </div>

              {/* Action Buttons Overlay */}
              <div className="absolute top-3 right-14 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  to={`/recipes/edit/${recipe._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 shadow-sm backdrop-blur-sm transition-colors"
                  aria-label={`Edit ${recipe.title}`}
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteTarget(recipe._id);
                  }}
                  className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 shadow-sm backdrop-blur-sm transition-colors"
                  aria-label={`Delete ${recipe.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        confirmColor="red"
      />
    </div>
  );
};

export default MyRecipesPage;
