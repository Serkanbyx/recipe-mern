import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

dotenv.config();

const recipes = [
  // ─── Breakfast (2) ───
  {
    title: 'Classic Pancakes',
    description:
      'Fluffy golden pancakes made from scratch with simple pantry staples. Perfectly stackable and ready for your favorite toppings like maple syrup, fresh berries, or whipped cream.',
    ingredients: [
      { amount: '2', unit: 'cups', name: 'All-purpose flour' },
      { amount: '2', unit: 'tbsp', name: 'Sugar' },
      { amount: '1', unit: 'tbsp', name: 'Baking powder' },
      { amount: '1/2', unit: 'tsp', name: 'Salt' },
      { amount: '2', unit: 'large', name: 'Eggs' },
      { amount: '1.5', unit: 'cups', name: 'Milk' },
      { amount: '3', unit: 'tbsp', name: 'Melted butter' },
    ],
    steps: [
      'Whisk flour, sugar, baking powder, and salt in a large bowl',
      'Beat eggs with milk and melted butter in a separate bowl',
      'Pour wet ingredients into dry and stir until just combined — lumps are okay',
      'Heat a non-stick skillet over medium heat and lightly grease',
      'Pour 1/4 cup batter per pancake and cook until bubbles form on the surface',
      'Flip and cook the other side for about one minute until golden brown',
    ],
    category: 'Breakfast',
    cookTime: 15,
    prepTime: 10,
    servings: 4,
    difficulty: 'Easy',
    tags: ['pancakes', 'breakfast', 'easy', 'classic'],
    status: 'published',
  },
  {
    title: 'Avocado Toast with Poached Egg',
    description:
      'A trendy yet timeless breakfast featuring creamy smashed avocado on crusty sourdough, topped with a perfectly poached egg and a sprinkle of chili flakes.',
    ingredients: [
      { amount: '2', unit: 'slices', name: 'Sourdough bread' },
      { amount: '1', unit: 'large', name: 'Ripe avocado' },
      { amount: '2', unit: 'large', name: 'Eggs' },
      { amount: '1', unit: 'tbsp', name: 'White vinegar' },
      { amount: '1', unit: 'pinch', name: 'Red chili flakes' },
      { amount: '1', unit: 'tbsp', name: 'Lemon juice' },
      { amount: '1', unit: 'pinch', name: 'Salt and pepper' },
    ],
    steps: [
      'Toast the sourdough slices until golden and crispy',
      'Halve the avocado, remove the pit, and scoop flesh into a bowl',
      'Mash avocado with lemon juice, salt, and pepper using a fork',
      'Bring a pot of water to a gentle simmer and add white vinegar',
      'Crack each egg into a small cup, create a gentle whirlpool, and slide the egg in',
      'Poach for 3-4 minutes until whites are set but yolk is still runny',
      'Spread mashed avocado on toast, place poached egg on top, and finish with chili flakes',
    ],
    category: 'Breakfast',
    cookTime: 10,
    prepTime: 5,
    servings: 2,
    difficulty: 'Medium',
    tags: ['avocado', 'toast', 'poached egg', 'healthy'],
    status: 'published',
  },

  // ─── Main Course (2) ───
  {
    title: 'Spaghetti Bolognese',
    description:
      'A rich and hearty Italian classic with slow-simmered beef ragù served over perfectly cooked spaghetti. This family-friendly dish is packed with deep tomato flavor and aromatic herbs.',
    ingredients: [
      { amount: '400', unit: 'g', name: 'Spaghetti' },
      { amount: '500', unit: 'g', name: 'Ground beef' },
      { amount: '1', unit: 'large', name: 'Onion, diced' },
      { amount: '3', unit: 'cloves', name: 'Garlic, minced' },
      { amount: '400', unit: 'ml', name: 'Crushed tomatoes' },
      { amount: '2', unit: 'tbsp', name: 'Tomato paste' },
      { amount: '1', unit: 'tsp', name: 'Dried oregano' },
      { amount: '1', unit: 'tsp', name: 'Dried basil' },
      { amount: '2', unit: 'tbsp', name: 'Olive oil' },
      { amount: '1', unit: 'pinch', name: 'Salt and pepper' },
    ],
    steps: [
      'Heat olive oil in a large saucepan over medium-high heat',
      'Sauté diced onion and garlic until softened and fragrant',
      'Add ground beef and cook until browned, breaking it apart with a spoon',
      'Stir in tomato paste, crushed tomatoes, oregano, and basil',
      'Reduce heat to low, cover, and simmer for at least 30 minutes',
      'Cook spaghetti in salted boiling water according to package directions',
      'Drain pasta and serve topped with the Bolognese sauce',
    ],
    category: 'Main Course',
    cookTime: 45,
    prepTime: 15,
    servings: 4,
    difficulty: 'Medium',
    tags: ['pasta', 'italian', 'beef', 'dinner'],
    status: 'published',
  },
  {
    title: 'Grilled Lemon Herb Chicken',
    description:
      'Juicy chicken breasts marinated in a bright blend of lemon, garlic, and fresh herbs then grilled to perfection. A versatile protein that pairs beautifully with salads, rice, or roasted vegetables.',
    ingredients: [
      { amount: '4', unit: 'pieces', name: 'Chicken breasts' },
      { amount: '3', unit: 'tbsp', name: 'Olive oil' },
      { amount: '2', unit: 'whole', name: 'Lemons, juiced' },
      { amount: '4', unit: 'cloves', name: 'Garlic, minced' },
      { amount: '2', unit: 'tbsp', name: 'Fresh rosemary, chopped' },
      { amount: '2', unit: 'tbsp', name: 'Fresh thyme, chopped' },
      { amount: '1', unit: 'tsp', name: 'Salt' },
      { amount: '1/2', unit: 'tsp', name: 'Black pepper' },
    ],
    steps: [
      'Whisk together olive oil, lemon juice, garlic, rosemary, thyme, salt, and pepper',
      'Place chicken breasts in a shallow dish and pour marinade over them',
      'Cover and refrigerate for at least 30 minutes or up to 4 hours',
      'Preheat grill to medium-high heat and lightly oil the grates',
      'Grill chicken for 6-7 minutes per side until internal temperature reaches 165°F',
      'Let the chicken rest for 5 minutes before slicing and serving',
    ],
    category: 'Main Course',
    cookTime: 15,
    prepTime: 40,
    servings: 4,
    difficulty: 'Easy',
    tags: ['chicken', 'grilled', 'lemon', 'herb', 'healthy'],
    status: 'published',
  },

  // ─── Dessert (2) ───
  {
    title: 'Chocolate Lava Cake',
    description:
      'An indulgent individual chocolate cake with a warm, molten center that flows like lava when you cut into it. Elegant enough for a dinner party yet surprisingly simple to prepare.',
    ingredients: [
      { amount: '200', unit: 'g', name: 'Dark chocolate, chopped' },
      { amount: '100', unit: 'g', name: 'Unsalted butter' },
      { amount: '2', unit: 'large', name: 'Eggs' },
      { amount: '2', unit: 'large', name: 'Egg yolks' },
      { amount: '50', unit: 'g', name: 'Sugar' },
      { amount: '30', unit: 'g', name: 'All-purpose flour' },
      { amount: '1', unit: 'pinch', name: 'Salt' },
    ],
    steps: [
      'Preheat oven to 220°C (425°F) and grease four ramekins with butter and cocoa powder',
      'Melt chocolate and butter together in a heatproof bowl over simmering water',
      'Whisk eggs, egg yolks, and sugar until thick and pale',
      'Fold the melted chocolate mixture into the egg mixture gently',
      'Sift in flour and salt, then fold until just combined',
      'Divide batter evenly among ramekins and bake for 12-14 minutes',
      'The edges should be firm but the center should still jiggle slightly',
      'Let cool for one minute, then invert onto plates and serve immediately',
    ],
    category: 'Dessert',
    cookTime: 14,
    prepTime: 20,
    servings: 4,
    difficulty: 'Hard',
    tags: ['chocolate', 'dessert', 'lava cake', 'elegant'],
    status: 'published',
  },
  {
    title: 'Classic Tiramisu',
    description:
      'An authentic Italian no-bake dessert layering espresso-soaked ladyfingers with a luscious mascarpone cream. Best made a day ahead for the flavors to meld beautifully.',
    ingredients: [
      { amount: '6', unit: 'large', name: 'Egg yolks' },
      { amount: '150', unit: 'g', name: 'Sugar' },
      { amount: '500', unit: 'g', name: 'Mascarpone cheese' },
      { amount: '300', unit: 'ml', name: 'Heavy cream' },
      { amount: '300', unit: 'ml', name: 'Strong espresso, cooled' },
      { amount: '3', unit: 'tbsp', name: 'Coffee liqueur (optional)' },
      { amount: '30', unit: 'pieces', name: 'Ladyfinger biscuits' },
      { amount: '2', unit: 'tbsp', name: 'Cocoa powder' },
    ],
    steps: [
      'Whisk egg yolks and sugar until thick and pale yellow',
      'Add mascarpone and beat until smooth and creamy',
      'Whip heavy cream to stiff peaks in a separate bowl, then fold into mascarpone mixture',
      'Mix cooled espresso with coffee liqueur if using',
      'Quickly dip each ladyfinger into espresso — do not soak them too long',
      'Arrange a layer of dipped ladyfingers in the bottom of a dish',
      'Spread half the mascarpone cream over the ladyfingers',
      'Repeat with another layer of ladyfingers and remaining cream',
      'Dust the top generously with cocoa powder, cover, and refrigerate for at least 4 hours',
    ],
    category: 'Dessert',
    cookTime: 0,
    prepTime: 30,
    servings: 8,
    difficulty: 'Medium',
    tags: ['tiramisu', 'italian', 'no-bake', 'coffee'],
    status: 'published',
  },

  // ─── Beverage (2) ───
  {
    title: 'Iced Matcha Latte',
    description:
      'A refreshing and vibrant green tea latte made with ceremonial-grade matcha powder and your choice of milk. Naturally energizing with a smooth, earthy flavor profile.',
    ingredients: [
      { amount: '2', unit: 'tsp', name: 'Matcha powder' },
      { amount: '2', unit: 'tbsp', name: 'Hot water' },
      { amount: '1', unit: 'cup', name: 'Milk of choice' },
      { amount: '1', unit: 'tbsp', name: 'Honey or sweetener' },
      { amount: '1', unit: 'cup', name: 'Ice cubes' },
    ],
    steps: [
      'Sift matcha powder into a bowl to remove any clumps',
      'Add hot water (not boiling, about 80°C) and whisk vigorously until smooth and frothy',
      'Stir in honey or sweetener until dissolved',
      'Fill a glass with ice cubes',
      'Pour milk over the ice until the glass is about three-quarters full',
      'Pour the matcha mixture over the milk and stir gently to combine',
    ],
    category: 'Beverage',
    cookTime: 5,
    prepTime: 3,
    servings: 1,
    difficulty: 'Easy',
    tags: ['matcha', 'latte', 'iced', 'healthy', 'drink'],
    status: 'published',
  },
  {
    title: 'Fresh Strawberry Lemonade',
    description:
      'A vibrant homemade lemonade bursting with fresh strawberry flavor. The perfect balance of sweet and tart, ideal for hot summer days or casual entertaining.',
    ingredients: [
      { amount: '2', unit: 'cups', name: 'Fresh strawberries, hulled' },
      { amount: '1', unit: 'cup', name: 'Fresh lemon juice' },
      { amount: '3/4', unit: 'cup', name: 'Sugar' },
      { amount: '4', unit: 'cups', name: 'Cold water' },
      { amount: '1', unit: 'cup', name: 'Ice cubes' },
      { amount: '4', unit: 'sprigs', name: 'Fresh mint (garnish)' },
    ],
    steps: [
      'Blend strawberries with 1 cup of water until completely smooth',
      'Strain through a fine-mesh sieve to remove seeds if desired',
      'Make simple syrup by dissolving sugar in 1 cup of hot water, then cool',
      'Combine strawberry puree, lemon juice, simple syrup, and remaining cold water in a pitcher',
      'Stir well and taste — adjust sweetness or tartness as needed',
      'Serve over ice and garnish with fresh mint sprigs',
    ],
    category: 'Beverage',
    cookTime: 5,
    prepTime: 10,
    servings: 4,
    difficulty: 'Easy',
    tags: ['lemonade', 'strawberry', 'summer', 'refreshing'],
    status: 'published',
  },

  // ─── Snack (2) ───
  {
    title: 'Crispy Garlic Parmesan Fries',
    description:
      'Golden, extra-crispy oven-baked fries tossed in a savory garlic-parmesan coating. A crowd-pleasing snack that delivers all the satisfaction of deep-fried without the mess.',
    ingredients: [
      { amount: '4', unit: 'large', name: 'Russet potatoes' },
      { amount: '3', unit: 'tbsp', name: 'Olive oil' },
      { amount: '4', unit: 'cloves', name: 'Garlic, minced' },
      { amount: '1/2', unit: 'cup', name: 'Grated Parmesan cheese' },
      { amount: '1', unit: 'tbsp', name: 'Fresh parsley, chopped' },
      { amount: '1', unit: 'tsp', name: 'Paprika' },
      { amount: '1', unit: 'pinch', name: 'Salt and pepper' },
    ],
    steps: [
      'Preheat oven to 220°C (425°F) and line a baking sheet with parchment paper',
      'Cut potatoes into even sticks and soak in cold water for 20 minutes to remove starch',
      'Drain and pat potatoes completely dry with paper towels',
      'Toss with olive oil, paprika, salt, and pepper in a large bowl',
      'Spread in a single layer on the baking sheet — do not overcrowd',
      'Bake for 25-30 minutes, flipping halfway, until golden and crispy',
      'Toss hot fries with minced garlic, Parmesan, and fresh parsley immediately after removing from oven',
    ],
    category: 'Snack',
    cookTime: 30,
    prepTime: 25,
    servings: 4,
    difficulty: 'Easy',
    tags: ['fries', 'garlic', 'parmesan', 'oven-baked'],
    status: 'published',
  },
  {
    title: 'Homemade Hummus',
    description:
      'Ultra-smooth and creamy hummus made from scratch with chickpeas, tahini, lemon, and garlic. A versatile dip perfect for pita bread, vegetables, or as a sandwich spread.',
    ingredients: [
      { amount: '400', unit: 'g', name: 'Canned chickpeas, drained' },
      { amount: '3', unit: 'tbsp', name: 'Tahini' },
      { amount: '2', unit: 'tbsp', name: 'Olive oil' },
      { amount: '2', unit: 'tbsp', name: 'Lemon juice' },
      { amount: '2', unit: 'cloves', name: 'Garlic' },
      { amount: '1/2', unit: 'tsp', name: 'Cumin' },
      { amount: '3', unit: 'tbsp', name: 'Ice water' },
      { amount: '1', unit: 'pinch', name: 'Salt' },
    ],
    steps: [
      'Add tahini and lemon juice to a food processor and blend for one minute until thick and creamy',
      'Add olive oil, garlic, cumin, and salt, then process for another 30 seconds',
      'Add half the chickpeas and process for one minute',
      'Add remaining chickpeas and blend while slowly drizzling in ice water',
      'Process for 3-4 minutes until completely smooth and light',
      'Taste and adjust lemon juice, salt, or garlic as needed',
      'Serve drizzled with olive oil and a sprinkle of paprika',
    ],
    category: 'Snack',
    cookTime: 1,
    prepTime: 10,
    servings: 6,
    difficulty: 'Easy',
    tags: ['hummus', 'dip', 'healthy', 'vegan', 'chickpea'],
    status: 'published',
  },

  // ─── Soup (2) ───
  {
    title: 'Creamy Tomato Basil Soup',
    description:
      'A velvety smooth tomato soup enriched with fresh basil and a touch of cream. The ultimate comfort food that pairs perfectly with a grilled cheese sandwich.',
    ingredients: [
      { amount: '1', unit: 'kg', name: 'Ripe tomatoes, halved' },
      { amount: '1', unit: 'large', name: 'Onion, diced' },
      { amount: '4', unit: 'cloves', name: 'Garlic' },
      { amount: '2', unit: 'cups', name: 'Vegetable broth' },
      { amount: '1/2', unit: 'cup', name: 'Heavy cream' },
      { amount: '1/4', unit: 'cup', name: 'Fresh basil leaves' },
      { amount: '2', unit: 'tbsp', name: 'Olive oil' },
      { amount: '1', unit: 'tbsp', name: 'Sugar' },
      { amount: '1', unit: 'pinch', name: 'Salt and pepper' },
    ],
    steps: [
      'Preheat oven to 200°C (400°F) and place halved tomatoes on a baking sheet',
      'Drizzle tomatoes with olive oil, season with salt, and roast for 25 minutes',
      'Sauté diced onion and garlic in a large pot until softened',
      'Add roasted tomatoes and vegetable broth, then bring to a simmer',
      'Cook for 15 minutes, then add fresh basil leaves',
      'Blend the soup until completely smooth using an immersion blender',
      'Stir in heavy cream and sugar, season to taste, and serve warm',
    ],
    category: 'Soup',
    cookTime: 45,
    prepTime: 15,
    servings: 6,
    difficulty: 'Easy',
    tags: ['tomato', 'soup', 'comfort food', 'creamy'],
    status: 'published',
  },
  {
    title: 'Thai Coconut Curry Soup',
    description:
      'A fragrant and warming Thai-inspired soup with coconut milk, tender vegetables, and aromatic spices. Mildly spiced with a perfect balance of sweet, salty, and sour flavors.',
    ingredients: [
      { amount: '400', unit: 'ml', name: 'Coconut milk' },
      { amount: '2', unit: 'cups', name: 'Vegetable broth' },
      { amount: '2', unit: 'tbsp', name: 'Thai red curry paste' },
      { amount: '200', unit: 'g', name: 'Mushrooms, sliced' },
      { amount: '1', unit: 'large', name: 'Red bell pepper, sliced' },
      { amount: '200', unit: 'g', name: 'Firm tofu, cubed' },
      { amount: '2', unit: 'tbsp', name: 'Fish sauce' },
      { amount: '1', unit: 'tbsp', name: 'Brown sugar' },
      { amount: '1', unit: 'whole', name: 'Lime, juiced' },
      { amount: '1/4', unit: 'cup', name: 'Fresh cilantro' },
    ],
    steps: [
      'Heat a tablespoon of coconut milk in a large pot over medium heat',
      'Add curry paste and stir-fry for one minute until fragrant',
      'Pour in the rest of the coconut milk and vegetable broth, bring to a simmer',
      'Add mushrooms, bell pepper, and tofu, then cook for 8-10 minutes',
      'Season with fish sauce and brown sugar, adjusting to taste',
      'Remove from heat and stir in fresh lime juice',
      'Serve in deep bowls garnished with fresh cilantro leaves',
    ],
    category: 'Soup',
    cookTime: 20,
    prepTime: 15,
    servings: 4,
    difficulty: 'Medium',
    tags: ['thai', 'coconut', 'curry', 'soup', 'spicy'],
    status: 'published',
  },

  // ─── Salad (2) ───
  {
    title: 'Caesar Salad with Homemade Croutons',
    description:
      'The iconic Caesar salad elevated with homemade garlic croutons and a rich, tangy dressing made from scratch. Crisp romaine lettuce and shaved Parmesan complete this timeless classic.',
    ingredients: [
      { amount: '2', unit: 'heads', name: 'Romaine lettuce, chopped' },
      { amount: '3', unit: 'slices', name: 'Bread, cubed for croutons' },
      { amount: '1/2', unit: 'cup', name: 'Parmesan cheese, shaved' },
      { amount: '3', unit: 'tbsp', name: 'Olive oil' },
      { amount: '2', unit: 'cloves', name: 'Garlic, minced' },
      { amount: '1', unit: 'tbsp', name: 'Dijon mustard' },
      { amount: '2', unit: 'tbsp', name: 'Lemon juice' },
      { amount: '1', unit: 'tsp', name: 'Worcestershire sauce' },
      { amount: '3', unit: 'tbsp', name: 'Mayonnaise' },
    ],
    steps: [
      'Preheat oven to 190°C (375°F) for the croutons',
      'Toss bread cubes with 1 tbsp olive oil and half the garlic, bake for 10-12 minutes until golden',
      'Whisk together remaining olive oil, remaining garlic, Dijon mustard, lemon juice, Worcestershire, and mayonnaise',
      'Wash, dry, and chop romaine lettuce into bite-sized pieces',
      'Place lettuce in a large bowl and drizzle with the dressing',
      'Toss gently to coat every leaf, then top with croutons and shaved Parmesan',
    ],
    category: 'Salad',
    cookTime: 12,
    prepTime: 15,
    servings: 4,
    difficulty: 'Easy',
    tags: ['caesar', 'salad', 'croutons', 'classic'],
    status: 'published',
  },
  {
    title: 'Mediterranean Quinoa Salad',
    description:
      'A colorful and nutritious Mediterranean-inspired salad with fluffy quinoa, crisp vegetables, kalamata olives, and crumbled feta dressed in a bright lemon vinaigrette.',
    ingredients: [
      { amount: '1', unit: 'cup', name: 'Quinoa, rinsed' },
      { amount: '1', unit: 'large', name: 'Cucumber, diced' },
      { amount: '1', unit: 'cup', name: 'Cherry tomatoes, halved' },
      { amount: '1/2', unit: 'cup', name: 'Kalamata olives, halved' },
      { amount: '1/2', unit: 'cup', name: 'Red onion, finely diced' },
      { amount: '100', unit: 'g', name: 'Feta cheese, crumbled' },
      { amount: '3', unit: 'tbsp', name: 'Extra virgin olive oil' },
      { amount: '2', unit: 'tbsp', name: 'Lemon juice' },
      { amount: '1', unit: 'tsp', name: 'Dried oregano' },
      { amount: '1/4', unit: 'cup', name: 'Fresh parsley, chopped' },
    ],
    steps: [
      'Cook quinoa in 2 cups of water — bring to a boil, reduce heat, cover, and simmer for 15 minutes',
      'Fluff quinoa with a fork and let it cool to room temperature',
      'Prepare all vegetables: dice cucumber, halve tomatoes and olives, finely dice red onion',
      'Whisk together olive oil, lemon juice, oregano, salt, and pepper for the dressing',
      'Combine cooled quinoa with all vegetables in a large bowl',
      'Pour dressing over the salad and toss gently',
      'Top with crumbled feta and fresh parsley before serving',
    ],
    category: 'Salad',
    cookTime: 15,
    prepTime: 15,
    servings: 4,
    difficulty: 'Easy',
    tags: ['quinoa', 'mediterranean', 'healthy', 'feta', 'salad'],
    status: 'published',
  },
];

const seedRecipes = async () => {
  try {
    await connectDB();

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found — run "npm run seed" first to create one');
      process.exit(1);
    }

    const existingCount = await Recipe.countDocuments();
    if (existingCount > 0) {
      console.log(`Skipped: ${existingCount} recipe(s) already exist in the database`);
      process.exit(0);
    }

    const recipesWithAuthor = recipes.map((recipe) => ({
      ...recipe,
      author: admin._id,
    }));

    // Recipe.create triggers pre('save') hooks so slugs are generated automatically
    const created = await Recipe.create(recipesWithAuthor);
    console.log(`${created.length} recipes seeded successfully by admin: ${admin.email}`);
  } catch (error) {
    console.error(`Recipe seed error: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
};

seedRecipes();
