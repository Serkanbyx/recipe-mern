import { Link } from 'react-router-dom';
import { Clock, Users, Heart } from 'lucide-react';

const difficultyColors = {
  Easy: 'bg-green-500/80 text-white',
  Medium: 'bg-amber-500/80 text-white',
  Hard: 'bg-red-500/80 text-white',
};

const RecipeCard = ({ recipe }) => {
  const {
    title,
    slug,
    description,
    image,
    category,
    difficulty,
    cookTime,
    servings,
    author,
    likesCount = 0,
  } = recipe;

  return (
    <Link
      to={`/recipes/${slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-16/10 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary-200 to-primary-400" />
        )}

        {/* Category Badge */}
        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-black/40 text-white backdrop-blur-sm">
            {category}
          </span>
        )}

        {/* Difficulty Badge */}
        {difficulty && (
          <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${difficultyColors[difficulty] || 'bg-gray-500/80 text-white'}`}>
            {difficulty}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
          {title}
        </h3>

        {description && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta Row */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
          {cookTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {cookTime} min
            </span>
          )}
          {servings > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {servings} servings
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 min-w-0">
            {author?.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-white text-xs font-semibold">
                {author?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {author?.name || 'Unknown'}
            </span>
          </div>

          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Heart className="w-4 h-4" />
            {likesCount}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
