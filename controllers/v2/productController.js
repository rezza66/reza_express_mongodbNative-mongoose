// import fs from 'fs';
// import path from 'path';
import Product from '../../models/v2/productModel.js';

export async function getProducts(req, res) {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

export async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}

export async function createProduct(req, res) {
    try {
        const product = new Product({
            name: req.body.name,
            price: parseFloat(req.body.price),
            stock: parseInt(req.body.stock),
            image: req.file ? req.file.path : ''
        });
        const newProduct = await product.save();
        res.json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
}

export async function updateProduct(req, res) {
    try {
        const product = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            stock: parseInt(req.body.stock),
            image: req.file ? req.file.filename : req.body.image
        };

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Handle old_image deletion if new image is uploaded
        // if (req.file && req.body.old_image) {
        //     const filePath = path.join(process.cwd(), 'uploads', req.body.old_image);
        //     try {
        //         fs.unlinkSync(filePath);
        //         console.log(`Deleted old image: ${filePath}`);
        //     } catch (err) {
        //         console.error(`Error deleting old image: ${err}`);
        //     }
        // }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
}

export async function deleteProduct(req, res) {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
}
