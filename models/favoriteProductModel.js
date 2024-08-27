// models/favoriteProductModel.js
import mongoose from 'mongoose';

const favoriteProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    },
  ],
});

const FavoriteProduct = mongoose.model('FavoriteProduct', favoriteProductSchema);

export default FavoriteProduct;
