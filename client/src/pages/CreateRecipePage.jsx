import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

import recipeService from '../services/recipeService';
import IngredientForm from '../components/recipe/IngredientForm';
import StepForm from '../components/recipe/StepForm';
import { CATEGORIES, DIFFICULTIES } from '../utils/constants';
import { getErrorMessage } from '../utils/helpers';

const DESCRIPTION_MAX_LENGTH = 1000;

const validateForm = (formData, ingredients, steps) => {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 3 || formData.title.trim().length > 100) {
    errors.title = 'Title must be between 3 and 100 characters.';
  }

  if (!formData.description || formData.description.trim().length < 10 || formData.description.trim().length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be between 10 and ${DESCRIPTION_MAX_LENGTH} characters.`;
  }

  if (!formData.category) {
    errors.category = 'Please select a category.';
  }

  if (!formData.cookTime || Number(formData.cookTime) < 1) {
    errors.cookTime = 'Cook time must be at least 1 minute.';
  }

  if (!formData.servings || Number(formData.servings) < 1 || Number(formData.servings) > 100) {
    errors.servings = 'Servings must be between 1 and 100.';
  }

  if (ingredients.length === 0) {
    errors.ingredients = 'At least 1 ingredient is required.';
  } else {
    const hasInvalid = ingredients.some(
      (ing) => !ing.amount.trim() || !ing.unit.trim() || !ing.name.trim()
    );
    if (hasInvalid) {
      errors.ingredients = 'Each ingredient must have amount, unit, and name filled.';
    }
  }

  if (steps.length === 0) {
    errors.steps = 'At least 1 step is required.';
  } else {
    const hasInvalid = steps.some((step) => step.text.trim().length < 5);
    if (hasInvalid) {
      errors.steps = 'Each step must be at least 5 characters.';
    }
  }

  return errors;
};

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    cookTime: '',
    prepTime: '',
    servings: '',
    difficulty: 'Medium',
    tags: '',
    status: 'published',
  });

  const [ingredients, setIngredients] = useState([
    { id: crypto.randomUUID(), amount: '', unit: 'g', name: '' },
  ]);
  const [steps, setSteps] = useState([
    { id: crypto.randomUUID(), text: '' },
  ]);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageData, setImageData] = useState({ url: '', publicId: '' });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB.');
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImageData({ url: '', publicId: '' });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleUploadImage = async () => {
    if (!image) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', image);
      const { data } = await recipeService.uploadImage(uploadData);
      setImageData({ url: data.data.url, publicId: data.data.publicId });
      setImage(null);
      setImagePreview('');
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
    setImageData({ url: '', publicId: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTagRemove = (tagToRemove) => {
    const currentTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && t !== tagToRemove);
    setFormData((prev) => ({ ...prev, tags: currentTags.join(', ') }));
  };

  const parsedTags = formData.tags
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, ingredients, steps);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        cookTime: Number(formData.cookTime),
        prepTime: Number(formData.prepTime) || 0,
        servings: Number(formData.servings),
        difficulty: formData.difficulty,
        status: formData.status,
        ingredients: ingredients.map(({ amount, unit, name }) => ({
          amount: amount.trim(),
          unit,
          name: name.trim(),
        })),
        steps: steps.map((step) => step.text.trim()),
        tags: tagsArray,
      };

      if (imageData.url) {
        payload.image = imageData.url;
        payload.imagePublicId = imageData.publicId;
      }

      const { data } = await recipeService.create(payload);
      toast.success('Recipe created!');
      navigate(`/recipes/${data.data.recipe.slug}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Create New Recipe
      </h1>

      <form onSubmit={handleSubmit} method="post" className="space-y-8">
        {/* Image Upload Section */}
        <section className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Recipe Image
          </label>

          {imageData.url ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={imageData.url}
                alt="Recipe"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : imagePreview ? (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleUploadImage}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </>
                )}
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                isDragOver
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
              }`}
              role="button"
              tabIndex={0}
              aria-label="Upload recipe image"
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageSelect(e.target.files[0])}
            className="hidden"
          />
        </section>

        {/* Basic Info Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Basic Information
          </h2>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={3}
              maxLength={100}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter recipe title"
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-colors`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              minLength={10}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your recipe..."
              maxLength={DESCRIPTION_MAX_LENGTH}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-colors resize-none`}
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className={`text-xs ml-auto ${
                formData.description.length > DESCRIPTION_MAX_LENGTH * 0.9
                  ? 'text-red-500'
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {formData.description.length}/{DESCRIPTION_MAX_LENGTH}
              </p>
            </div>
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.category
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-colors`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Time & Servings */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Time & Servings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prep Time (min)
              </label>
              <input
                id="prepTime"
                name="prepTime"
                type="number"
                min="0"
                value={formData.prepTime}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cook Time (min) <span className="text-red-500">*</span>
              </label>
              <input
                id="cookTime"
                name="cookTime"
                type="number"
                required
                min="1"
                value={formData.cookTime}
                onChange={handleChange}
                placeholder="30"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.cookTime
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-colors`}
              />
              {errors.cookTime && (
                <p className="mt-1 text-sm text-red-500">{errors.cookTime}</p>
              )}
            </div>

            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Servings <span className="text-red-500">*</span>
              </label>
              <input
                id="servings"
                name="servings"
                type="number"
                required
                min="1"
                max="100"
                value={formData.servings}
                onChange={handleChange}
                placeholder="4"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.servings
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-colors`}
              />
              {errors.servings && (
                <p className="mt-1 text-sm text-red-500">{errors.servings}</p>
              )}
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Ingredients <span className="text-red-500">*</span>
          </h2>
          <IngredientForm ingredients={ingredients} onChange={setIngredients} />
          {errors.ingredients && (
            <p className="text-sm text-red-500">{errors.ingredients}</p>
          )}
        </section>

        {/* Steps Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Steps <span className="text-red-500">*</span>
          </h2>
          <StepForm steps={steps} onChange={setSteps} />
          {errors.steps && (
            <p className="text-sm text-red-500">{errors.steps}</p>
          )}
        </section>

        {/* Tags Section */}
        <section className="space-y-3">
          <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. italian, pasta, quick meal"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
          />
          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {parsedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="hover:text-red-500 transition-colors"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Status Toggle */}
        <section className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Publish</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Save as Draft</span>
            </label>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Recipe'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipePage;
