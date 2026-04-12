const SettingsPage = ({ tab = 'profile' }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Settings — {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </h1>
    </div>
  );
};

export default SettingsPage;
