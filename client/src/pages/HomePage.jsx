import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChefHat, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import { SORT_OPTIONS } from '../utils/constants';
import SearchBar from '../components/recipe/SearchBar';
import CategoryFilter from '../components/recipe/CategoryFilter';
import RecipeGrid from '../components/recipe/RecipeGrid';
import Pagination from '../components/ui/Pagination';
import { RecipeGridSkeleton } from '../components/ui/RecipeCardSkeleton';

const LIMIT = 12;

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const updateParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (!value || value === 'newest' && key === 'sort' || value === '1' && key === 'page') {
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

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const params = { page, limit: LIMIT, sort };
        if (search) params.search = search;
        if (category) params.category = category;

        const { data } = await recipeService.getAll(params);
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
    };

    fetchRecipes();
  }, [search, category, sort, page]);

  const handleSearch = useCallback(
    (value) => {
      updateParams({ search: value, page: '1' });
    },
    [updateParams]
  );

  const handleCategoryChange = useCallback(
    (value) => {
      updateParams({ category: value, page: '1' });
    },
    [updateParams]
  );

  const handleSortChange = useCallback(
    (e) => {
      updateParams({ sort: e.target.value, page: '1' });
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="w-12 h-12 text-primary-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Discover Delicious Recipes
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore thousands of recipes from home cooks and professional chefs around the world.
          </p>
          {isAuthenticated && (
            <Link
              to="/recipes/new"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary-400 hover:bg-primary-500 rounded-xl shadow-sm transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Share Your Recipe
            </Link>
          )}
        </div>
      </section>

      {/* Filters & Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} initialValue={search} />

        {/* Category Filter */}
        <CategoryFilter
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? (
              'Searching...'
            ) : (
              <>
                <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
                {' '}recipe{total !== 1 ? 's' : ''} found
              </>
            )}
          </p>

          <select
            value={sort}
            onChange={handleSortChange}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-shadow"
            aria-label="Sort recipes"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Recipe Grid or Loading */}
        {loading ? (
          <RecipeGridSkeleton />
        ) : (
          <RecipeGrid
            recipes={recipes}
            emptyMessage={
              search || category
                ? 'No recipes match your filters. Try adjusting your search or category.'
                : 'No recipes yet. Be the first to share one!'
            }
          />
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
      </section>
    </div>
  );
};

export default HomePage;
