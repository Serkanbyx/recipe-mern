const colorMap = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  user: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const RoleBadge = ({ role }) => {
  const colorClass = colorMap[role] || colorMap.user;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${colorClass}`}>
      {role}
    </span>
  );
};

export default RoleBadge;
