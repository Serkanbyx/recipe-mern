const SelectableCard = ({ selected, onClick, icon: Icon, label, description }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
        cursor-pointer text-center w-full
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-gray-900
        ${
          selected
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
    >
      {Icon && (
        <Icon
          className={`w-6 h-6 ${
            selected
              ? 'text-orange-500'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        />
      )}
      <span
        className={`text-sm font-medium ${
          selected
            ? 'text-orange-700 dark:text-orange-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {label}
      </span>
      {description && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </span>
      )}
    </button>
  );
};

export default SelectableCard;
