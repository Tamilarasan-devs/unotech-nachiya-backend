import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import Wishlist from '../models/wishlistModel';

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }
    
    res.json(wishlist);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch wishlist');
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    const itemIndex = wishlist.items.findIndex(item => item.toString() === productId);
    
    if (itemIndex > -1) {
      wishlist.items.splice(itemIndex, 1);
    } else {
      wishlist.items.push(productId);
    }

    await wishlist.save();
    await wishlist.populate('items');
    
    res.json(wishlist);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to toggle wishlist');
  }
};

export const mergeWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body; // Array of productIds
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items');
      return res.json(wishlist);
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    for (const productId of items) {
      const exists = wishlist.items.some(item => item.toString() === productId);
      if (!exists) {
        wishlist.items.push(productId);
      }
    }

    await wishlist.save();
    await wishlist.populate('items');
    
    res.json(wishlist);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to merge wishlist');
  }
};
