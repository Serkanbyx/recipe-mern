import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Bookmark,
  Pencil,
  Trash2,
  Clock,
  Users,
  ChefHat,
  Calendar,
  Home,
  ChevronRight,
  Check,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import favoriteService from '../services/favoriteService';
import RecipeDetailSkeleton from '../components/ui/RecipeDetailSkeleton';
import ConfirmModal from '../components/ui/ConfirmModal';
import { formatDate } from '../utils/formatDate';
import { formatCookTime, getErrorMessage } from '../utils/helpers';

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

const RecipeDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favorited, setFavorited] = useState(false);

  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [checkedSteps, setCheckedSteps] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isOwner = user && recipe?.author?._id === user._id;
  const canModify = isOwner || isAdmin;

  const fetchRecipe = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await recipeService.getBySlug(slug);
      const r = data.data;

      setRecipe(r);
      setLikesCount(r.likesCount || 0);
      setLiked(r.likes?.includes(user?._id) || false);
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error(getErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  }, [slug, user?._id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  // Check favorite status when recipe loads
  useEffect(() => {
    if (!recipe?._id || !isAuthenticated) return;

    const checkFavoriteStatus = async () => {
      try {
        const { data } = await favoriteService.checkFavorite(recipe._id);
        setFavorited(data.data?.isFavorited || false);
      } catch {
        /* silently fail */
      }
    };

    checkFavoriteStatus();
  }, [recipe?._id, isAuthenticated]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like recipes');
      navigate('/login');
      return;
    }

    const prevLiked = liked;
    const prevCount = likesCount;

    setLiked(!liked);
    setLikesCount((c) => (liked ? c - 1 : c + 1));

    try {
      await recipeService.toggleLike(recipe._id);
    } catch (error) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error(getErrorMessage(error));
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save recipes');
      navigate('/login');
      return;
    }

    const prevFavorited = favorited;
    setFavorited(!favorited);

    try {
      await favoriteService.toggleFavorite(recipe._id);
      toast.success(favorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      setFavorited(prevFavorited);
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await recipeService.delete(recipe._id);
      toast.success('Recipe deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleStep = (index) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return <RecipeDetailSkeleton />;
  }

  if (notFound || !recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Recipe Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The recipe you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        {recipe.category && (
          <>
            <Link
              to={`/?category=${recipe.category}`}
              className="hover:text-primary-600 transition-colors"
            >
              {recipe.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="text-gray-900 dark:text-white font-medium truncate">
          {recipe.title}
        </span>
      </nav>

      {/* 2. Hero Section */}
      <div className="relative w-full max-h-[400px] rounded-2xl overflow-hidden mb-8">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full max-h-[400px] object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white/80 text-center px-8">
              {recipe.title}
            </h2>
          </div>
        )}
      </div>

      {/* 3. Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          {recipe.title}
        </h1>

        <div className="flex items-center gap-2 shrink-0">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              liked
                ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400'
            }`}
            aria-label={liked ? 'Unlike recipe' : 'Like recipe'}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            {likesCount}
          </button>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              favorited
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400'
            }`}
            aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Bookmark className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
          </button>

          {/* Edit Button */}
          {canModify && (
            <Link
              to={`/recipes/edit/${recipe._id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
              aria-label="Edit recipe"
            >
              <Pencil className="w-5 h-5" />
            </Link>
          )}

          {/* Delete Button */}
          {canModify && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
              aria-label="Delete recipe"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Meta Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {recipe.category && (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400">
            {recipe.category}
          </span>
        )}

        {recipe.difficulty && (
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${difficultyColors[recipe.difficulty] || 'bg-gray-100 text-gray-700'}`}>
            {recipe.difficulty}
          </span>
        )}

        {recipe.prepTime > 0 && (
          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            Prep: {formatCookTime(recipe.prepTime)}
          </span>
        )}

        {recipe.cookTime > 0 && (
          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            Cook: {formatCookTime(recipe.cookTime)}
          </span>
        )}

        {totalTime > 0 && (
          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 font-medium">
            <Clock className="w-4 h-4" />
            Total: {formatCookTime(totalTime)}
          </span>
        )}

        {recipe.servings > 0 && (
          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            {recipe.servings} servings
          </span>
        )}

        {recipe.author && (
          <Link
            to={`/profile/${recipe.author._id}`}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {recipe.author.avatar ? (
              <img
                src={recipe.author.avatar}
                alt={recipe.author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary-400 flex items-center justify-center text-white text-[10px] font-semibold">
                {recipe.author.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            {recipe.author.name}
          </Link>
        )}

        {recipe.createdAt && (
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            {formatDate(recipe.createdAt)}
          </span>
        )}
      </div>

      {/* 5. Description */}
      {recipe.description && (
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
          {recipe.description}
        </p>
      )}

      {/* 6. Tags */}
      {recipe.tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Tag className="w-4 h-4 text-gray-400" />
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 7. Ingredients */}
      {recipe.ingredients?.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ingredients
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400">
              {recipe.ingredients.length}
            </span>
          </div>

          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <button
                  onClick={() => toggleIngredient(index)}
                  className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded border-2 shrink-0 transition-colors ${
                      checkedIngredients[index]
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 group-hover:border-primary-400'
                    }`}
                  >
                    {checkedIngredients[index] && <Check className="w-3 h-3" />}
                  </span>
                  <span
                    className={`text-gray-700 dark:text-gray-300 transition-colors ${
                      checkedIngredients[index] ? 'line-through text-gray-400 dark:text-gray-500' : ''
                    }`}
                  >
                    {[ingredient.amount, ingredient.unit, ingredient.name]
                      .filter(Boolean)
                      .join(' ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 8. Steps */}
      {recipe.steps?.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Instructions
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400">
              {recipe.steps.length}
            </span>
          </div>

          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index}>
                <button
                  onClick={() => toggleStep(index)}
                  className="flex items-start gap-4 w-full text-left p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 transition-colors ${
                      checkedSteps[index]
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-primary-100 group-hover:text-primary-700 dark:group-hover:bg-primary-900/40 dark:group-hover:text-primary-400'
                    }`}
                  >
                    {checkedSteps[index] ? <Check className="w-4 h-4" /> : index + 1}
                  </span>
                  <span
                    className={`text-gray-700 dark:text-gray-300 leading-relaxed pt-1 transition-colors ${
                      checkedSteps[index] ? 'line-through text-gray-400 dark:text-gray-500' : ''
                    }`}
                  >
                    {typeof step === 'string' ? step : step.text || step.description}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 9. Author Card */}
      {recipe.author && (
        <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            {recipe.author.avatar ? (
              <img
                src={recipe.author.avatar}
                alt={recipe.author.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary-400 flex items-center justify-center text-white text-xl font-semibold">
                {recipe.author.name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {recipe.author.name}
              </h3>
              {recipe.author.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
                  {recipe.author.bio}
                </p>
              )}
            </div>

            <Link
              to={`/profile/${recipe.author._id}`}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shrink-0"
            >
              View Profile
            </Link>
          </div>
        </section>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
};

export default RecipeDetailPage;
