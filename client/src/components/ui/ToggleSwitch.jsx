const ToggleSwitch = ({ checked, onChange, label, description, id }) => {
  const switchId = id || `toggle-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        {label && (
          <label
            htmlFor={switchId}
            className="block text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
          >
            {label}
          </label>
        )}
        {description && (
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
          border-2 border-transparent transition-colors duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-gray-900
          ${checked ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full
            bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
