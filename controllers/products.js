import { getDb } from '../db/connect.js';
import { ObjectId } from 'mongodb';

export async function getAllProducts(req, res) {
  try {
    const db = getDb();
    const products = await db.collection('products').find().toArray();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getSingleProduct(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function createProduct(req, res) {
  try {
    const db = getDb();

    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      team: req.body.team,
      year: Number(req.body.year),
      sizes: req.body.sizes,
    };

    const response = await db.collection('products').insertOne(newProduct);

    if (response.acknowledged) {
      res.status(201).json({
        message: 'Product created successfully',
        productId: response.insertedId,
      });
    } else {
      res.status(500).json({ message: 'Creation failed.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function updateProduct(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const productId = new ObjectId(req.params.id);

    const updatedProduct = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      team: req.body.team,
      year: Number(req.body.year),
      sizes: req.body.sizes,
    };

    const response = await db
      .collection('products')
      .updateOne({ _id: productId }, { $set: updatedProduct });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(200).json({ message: 'No changes were made to the product.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteProduct(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const response = await db
      .collection('products')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
