import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/userModel';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB');

    const adminExists = await User.findOne({ email: 'admin@nachiya.com' });
    
    if (adminExists) {
      console.log('Admin already exists! Password is password123');
      process.exit();
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@nachiya.com',
      password: 'password123',
      isAdmin: true,
    });

    if (admin) {
      console.log('Admin user created successfully!');
      console.log('Email: admin@nachiya.com');
      console.log('Password: password123');
    }
    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

createAdmin();
