import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/productModel';

dotenv.config();

const clearProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB');
    await Product.deleteMany();
    console.log('Products cleared!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

clearProducts();
