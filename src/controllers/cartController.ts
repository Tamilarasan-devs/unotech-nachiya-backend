import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import Cart from '../models/cartModel';
import Product from '../models/productModel';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch cart');
  }
};

// @desc    Add/Update item in cart
// @route   POST /api/cart
// @access  Private
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex > -1) {
      // Update quantity or remove if <= 0
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to update cart');
  }
};

// @desc    Merge local cart with DB cart
// @route   POST /api/cart/merge
// @access  Private
export const mergeCart = async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body; // Array of { productId, quantity }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      return res.json(cart);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Merge logic: Add quantities if item exists, else push new
    for (const localItem of items) {
      const { productId, quantity } = localItem;
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to merge cart');
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to clear cart');
  }
};
