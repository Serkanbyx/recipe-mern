const colorMap = {
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const StatusBadge = ({ status }) => {
  const colorClass = colorMap[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
