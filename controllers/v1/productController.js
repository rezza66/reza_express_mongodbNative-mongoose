import { MongoClient, ObjectId } from 'mongodb';
import productSchema from '../../models/v1/productModel.js';

const uri = 'mongodb://localhost:27017/mongodbNative-mongoose_db';
const client = new MongoClient(uri, { family: 4 });

let collection;

async function connect() {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
        }
        collection = client.db('mongodbNative-mongoose_db').collection('products');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}

function validateProduct(product) {
    const schemaKeys = Object.keys(productSchema);
    for (const key of schemaKeys) {
        const expectedType = productSchema[key].name.toLowerCase();
        if (typeof product[key] !== expectedType) {
            return false;
        }
    }
    return true;
}

export async function getProducts(req, res) {
    try {
        await connect();
        const products = await collection.find({}).toArray();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getProductById(req, res) {
    try {
        await connect();
        const product = await collection.findOne({ _id: new ObjectId(req.params.id) });
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function createProduct(req, res) {
    try {
        await connect();
        const product = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            image: req.file ? req.file.path : ''
        };

        if (!validateProduct(product)) {
            return res.status(400).json({ error: 'Invalid product data' });
        }

        const result = await collection.insertOne(product);
        res.json({ _id: result.insertedId, ...product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function updateProduct(req, res) {
    try {
        await connect();
        const product = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            image: req.file ? req.file.path : req.body.image
        };

        if (!validateProduct(product)) {
            return res.status(400).json({ error: 'Invalid product data' });
        }

        const result = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: product });
        res.json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function deleteProduct(req, res) {
    try {
        await connect();
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
