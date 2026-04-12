const CharacterCounter = ({ current = 0, max }) => {
  const ratio = current / max;
  const isNearLimit = ratio >= 0.9;
  const isOverLimit = current > max;

  const colorClass = isOverLimit
    ? 'text-red-600 dark:text-red-400 font-semibold'
    : isNearLimit
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-gray-400 dark:text-gray-500';

  return (
    <span className={`text-xs transition-colors ${colorClass}`}>
      {current}/{max}
    </span>
  );
};

export default CharacterCounter;
