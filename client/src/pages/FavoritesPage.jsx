import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, Bookmark, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import favoriteService from '../services/favoriteService';
import { getErrorMessage } from '../utils/helpers';
import RecipeCard from '../components/recipe/RecipeCard';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { RecipeGridSkeleton } from '../components/ui/RecipeCardSkeleton';

const LIMIT = 12;

const FavoritesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await favoriteService.getMyFavorites({ page, limit: LIMIT });
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
  }, [page]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handlePageChange = useCallback(
    (newPage) => {
      updateParams({ page: String(newPage) });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateParams]
  );

  const handleUnfavorite = useCallback(async (recipeId) => {
    try {
      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      setTotal((prev) => prev - 1);
      await favoriteService.toggleFavorite(recipeId);
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error(getErrorMessage(error));
      await fetchFavorites();
    }
  }, [fetchFavorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
        {!loading && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
            {' '}favorite{total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <RecipeGridSkeleton />
      ) : recipes.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          message="Browse recipes and save your favorites!"
          action={{ to: '/', label: 'Browse Recipes', icon: BookOpen }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="relative group">
              <RecipeCard recipe={recipe} />

              {/* Unfavorite Button Overlay */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnfavorite(recipe._id);
                }}
                className="absolute top-3 right-14 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                aria-label={`Remove ${recipe.title} from favorites`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
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
    </div>
  );
};

export default FavoritesPage;
