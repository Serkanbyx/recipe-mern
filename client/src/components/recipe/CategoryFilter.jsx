import { CATEGORIES } from '../../utils/constants';

const allCategories = ['All', ...CATEGORIES];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="group" aria-label="Category filter">
      {allCategories.map((category) => {
        const isActive =
          category === 'All'
            ? !activeCategory
            : activeCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category === 'All' ? '' : category)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-400 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:text-primary-500'
            }`}
            aria-pressed={isActive}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
