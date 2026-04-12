import mongoose from 'mongoose';
import slugify from 'slugify';

const ingredientSchema = new mongoose.Schema(
  {
    amount: {
      type: String,
      required: [true, 'Ingredient amount is required'],
      trim: true,
      maxlength: [20, 'Amount cannot exceed 20 characters'],
    },
    unit: {
      type: String,
      required: [true, 'Ingredient unit is required'],
      trim: true,
      maxlength: [20, 'Unit cannot exceed 20 characters'],
    },
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
      maxlength: [50, 'Ingredient name cannot exceed 50 characters'],
    },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    ingredients: {
      type: [ingredientSchema],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: (val) => val.length >= 1,
        message: 'At least one ingredient is required',
      },
    },
    steps: {
      type: [
        {
          type: String,
          trim: true,
          minlength: [5, 'Each step must be at least 5 characters'],
          maxlength: [500, 'Each step cannot exceed 500 characters'],
        },
      ],
      required: [true, 'At least one step is required'],
      validate: {
        validator: (val) => val.length >= 1,
        message: 'At least one step is required',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Breakfast', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Soup', 'Salad'],
        message: '{VALUE} is not a valid category',
      },
    },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [0, 'Cook time cannot be negative'],
    },
    prepTime: {
      type: Number,
      min: [0, 'Prep time cannot be negative'],
      default: 0,
    },
    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Servings must be at least 1'],
      max: [100, 'Servings cannot exceed 100'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty level',
      },
      default: 'Medium',
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a valid status',
      },
      default: 'published',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, 'Tag cannot exceed 30 characters'],
      },
    ],
  },
  { timestamps: true }
);

// Indexes
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ category: 1, status: 1 });
recipeSchema.index({ author: 1 });
// slug uniqueness is enforced via field-level `unique: true`
recipeSchema.index({ createdAt: -1 });

// Virtuals
recipeSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

recipeSchema.virtual('totalTime').get(function () {
  return this.prepTime + this.cookTime;
});

recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

// Mongoose 9 — async pre-save without next parameter
recipeSchema.pre('save', async function () {
  if (!this.isModified('title')) return;

  this.slug = slugify(this.title, { lower: true, strict: true });

  const existingRecipe = await mongoose.model('Recipe').findOne({
    slug: this.slug,
    _id: { $ne: this._id },
  });

  if (existingRecipe) {
    this.slug = `${this.slug}-${Math.random().toString(36).substring(2, 6)}`;
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
