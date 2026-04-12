import RecipeCard from './RecipeCard';
import EmptyState from '../ui/EmptyState';
import { BookOpen } from 'lucide-react';

const RecipeGrid = ({ recipes, emptyMessage = 'No recipes found.' }) => {
  if (!recipes || recipes.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No recipes"
        message={emptyMessage}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeGrid;
