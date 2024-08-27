import express from 'express';
import multer from 'multer';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  // searchProductsByName,
} from '../controllers/productController.js';

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be stored temporarily in the 'uploads' folder

router.get('/search', searchProducts); 
router.get('/:id', getProductById);
router.get('/', getProducts);
router.post('/', upload.single('image'), createProduct); // Use 'upload.single' to handle image uploads
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/category', getProductsByCategory); // Change to POST for category
export default router;
