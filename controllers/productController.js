import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinaryConfig.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ecommerce', // Specify the folder where the images will be stored in Cloudinary
    });

    // Create a new product with the Cloudinary image URL
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      stock,
      image: result.secure_url, // Use the Cloudinary URL
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  const { category } = req.body;
  // console.log(req.body, 'req.body'); // For debugging

  try {
    // Check if category is provided
    if (!category) {
      return res.status(400).json({ message: 'Category in the request body is required' });
    }

    // Find products by category
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Search products based on query parameters
// export const searchProducts = async (req, res) => {
//   console.log(req.params);
  
//   try {
//     const { name, category, minPrice, maxPrice, description } = req.query;

//     // Build the search filter based on provided query parameters
//     const searchFilter = {};

//     if (name) {
//       // Case-insensitive search by name
//       searchFilter.name = { $regex: name, $options: 'i' };
//     }

//     if (category) {
//       // Search by category
//       searchFilter.category = category;
//     }

//     if (minPrice || maxPrice) {
//       // Search by price range
//       searchFilter.price = {};
//       if (minPrice) searchFilter.price.$gte = Number(minPrice);
//       if (maxPrice) searchFilter.price.$lte = Number(maxPrice);
//     }

//     if (description) {
//       // Case-insensitive search by description
//       searchFilter.description = { $regex: description, $options: 'i' };
//     }

//     // Find products matching the search filter
//     const products = await Product.find(searchFilter);
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// Search products by name
// export const searchProductsByName = async (req, res) => {
//   try {
//     const { name } = req.query;

//     // Check if the name is provided in the query
//     if (!name) {
//       return res.status(400).json({ message: 'Product name query parameter is required' });
//     }

//     // Case-insensitive search by product name
//     const products = await Product.find({ name: { $regex: name, $options: 'i' } });

//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// Search products with various filters
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from the request query parameters

    // Check if there is a query to search for
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Build the search criteria object dynamically based on the provided query parameter
    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: 'i' } },       // Search in 'name' field (case-insensitive)
        { category: { $regex: query, $options: 'i' } },   // Search in 'category' field (case-insensitive)
        { description: { $regex: query, $options: 'i' } }, // Search in 'description' field (case-insensitive)
        // Add more fields as needed
      ]
    };

    // Execute the search with the built criteria
    const products = await Product.find(searchCriteria);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



