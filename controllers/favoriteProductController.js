// controllers/favoriteProductController.js
import FavoriteProduct from '../models/favoriteProductModel.js';
import Product from '../models/productModel.js';

// Add a product to favorites
export const addToFavorites = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    let favorite = await FavoriteProduct.findOne({ user: userId });

    if (!favorite) {
      favorite = new FavoriteProduct({ user: userId, products: [] });
    }

    const existingProduct = favorite.products.find(item => item.product.toString() === productId);

    if (existingProduct) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }

    favorite.products.push({ product: productId });

    await favorite.save();
    res.status(200).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get favorite products
export const getFavorites = async (req, res) => {
  const userId = req.user._id;

  try {
    const favorite = await FavoriteProduct.findOne({ user: userId }).populate('products.product', 'name price image');

    if (!favorite) {
      return res.status(404).json({ message: 'No favorites found' });
    }

    res.status(200).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a single product from favorites
export const removeSingleFavorite = async (req, res) => {
    const { productId } = req.params; // Get productId from URL params
    const userId = req.user._id;
  
    try {
      const favorite = await FavoriteProduct.findOne({ user: userId });
  
      if (!favorite) {
        return res.status(404).json({ message: 'No favorites found' });
      }
  
      const productIndex = favorite.products.findIndex(item => item.product.toString() === productId);
  
      if (productIndex > -1) {
        favorite.products.splice(productIndex, 1);
        await favorite.save();
        res.status(200).json({ message: 'Product removed from favorites', favorite });
      } else {
        res.status(404).json({ message: 'Product not found in favorites' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Clear all favorite products
export const clearFavorites = async (req, res) => {
  const userId = req.user._id;

  try {
    const favorite = await FavoriteProduct.findOne({ user: userId });

    if (!favorite) {
      return res.status(404).json({ message: 'No favorites found' });
    }

    favorite.products = [];
    await favorite.save();
    res.status(200).json({ message: 'All favorite products cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
