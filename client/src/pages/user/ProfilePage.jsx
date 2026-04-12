import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Mail, Calendar, BookOpen, Heart, Settings, AlertCircle, ChefHat,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import RecipeGrid from '../../components/recipe/RecipeGrid';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';

const LIMIT = 12;
const TABS = { RECIPES: 'recipes', FAVORITES: 'favorites' };

const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 space-y-3 text-center sm:text-left">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto sm:mx-0" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72 mx-auto sm:mx-0" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto sm:mx-0" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="aspect-16/10 bg-gray-200 dark:bg-gray-700" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.RECIPES);
  const [recipePage, setRecipePage] = useState(1);
  const [favoritePage, setFavoritePage] = useState(1);
  const [tabLoading, setTabLoading] = useState(false);

  const isOwnProfile = currentUser?._id === userId;

  const fetchProfile = useCallback(async (rPage = 1, fPage = 1) => {
    try {
      const { data } = await userService.getPublicProfile(userId, {
        recipePage: rPage,
        favoritePage: fPage,
        limit: LIMIT,
      });
      setProfile(data.data.profile);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load profile';
      setError(message);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setActiveTab(TABS.RECIPES);
      setRecipePage(1);
      setFavoritePage(1);
      await fetchProfile(1, 1);
      setLoading(false);
    };
    load();
  }, [fetchProfile]);

  // Tab pagination changes
  useEffect(() => {
    if (loading || !profile) return;

    const refetch = async () => {
      setTabLoading(true);
      await fetchProfile(recipePage, favoritePage);
      setTabLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipePage, favoritePage]);

  const handleRecipePageChange = useCallback((page) => {
    setRecipePage(page);
  }, []);

  const handleFavoritePageChange = useCallback((page) => {
    setFavoritePage(page);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Not Found</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{error}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-400 hover:bg-primary-500 rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const showFavorites = profile.privacy?.showFavorites;
  const tabs = [
    { id: TABS.RECIPES, label: 'Recipes', icon: BookOpen, count: profile.recipes?.total },
  ];

  if (showFavorites) {
    tabs.push({ id: TABS.FAVORITES, label: 'Favorites', icon: Heart, count: profile.favorites?.total });
  }

  const activeRecipes = activeTab === TABS.RECIPES ? profile.recipes : profile.favorites;
  const activePage = activeTab === TABS.RECIPES ? recipePage : favoritePage;
  const activePageHandler = activeTab === TABS.RECIPES ? handleRecipePageChange : handleFavoritePageChange;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900/30"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center ring-4 ring-primary-50 dark:ring-primary-900/20">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {getInitials(profile.name)}
              </span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                <ChefHat className="w-3.5 h-3.5" />
                {profile.recipes?.total || 0} recipe{profile.recipes?.total !== 1 ? 's' : ''}
              </span>
            </div>

            {profile.bio && (
              <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
              {profile.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Member since {formatDate(profile.createdAt)}
              </span>
            </div>

            {isOwnProfile && (
              <Link
                to="/settings"
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-6 -mb-px" aria-label="Profile tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary-400 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                aria-selected={isActive}
                role="tab"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {tabLoading ? (
        <Spinner />
      ) : (
        <>
          <RecipeGrid
            recipes={activeRecipes?.items || []}
            emptyMessage={
              activeTab === TABS.RECIPES
                ? 'No recipes published yet.'
                : 'No favorite recipes yet.'
            }
          />

          {activeRecipes && activeRecipes.totalPages > 1 && (
            <div className="pt-4">
              <Pagination
                page={activePage}
                totalPages={activeRecipes.totalPages}
                onPageChange={activePageHandler}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
