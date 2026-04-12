import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(`Admin already exists: ${existingAdmin.email}`);
    } else {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@recipeapp.com',
        password: 'Admin123!',
        role: 'admin',
      });
      console.log(`Admin user created: ${admin.email}`);
    }
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
};

seedAdmin();
