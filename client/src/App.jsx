import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import SettingsLayout from './components/layout/SettingsLayout';

import ProtectedRoute from './components/guards/ProtectedRoute';
import AdminRoute from './components/guards/AdminRoute';
import GuestOnlyRoute from './components/guards/GuestOnlyRoute';

import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import MyRecipesPage from './pages/MyRecipesPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRecipesPage from './pages/admin/AdminRecipesPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />

          {/* Guest Only */}
          <Route path="/login" element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>} />
          <Route path="/register" element={<GuestOnlyRoute><RegisterPage /></GuestOnlyRoute>} />

          {/* Protected */}
          <Route path="/recipes/new" element={<ProtectedRoute><CreateRecipePage /></ProtectedRoute>} />
          <Route path="/recipes/edit/:id" element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>} />
          <Route path="/my-recipes" element={<ProtectedRoute><MyRecipesPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />

          {/* Settings (nested layout) */}
          <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}>
            <Route index element={<SettingsPage tab="profile" />} />
            <Route path="account" element={<SettingsPage tab="account" />} />
            <Route path="appearance" element={<SettingsPage tab="appearance" />} />
            <Route path="privacy" element={<SettingsPage tab="privacy" />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="recipes" element={<AdminRecipesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
