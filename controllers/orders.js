import { getDb } from '../db/connect.js';
import { ObjectId } from 'mongodb';

export async function getAllOrders(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must login to view orders.' });
    }

    const db = getDb();
    let query = {};

    if (req.user.role !== 'admin') {
      query = { userId: req.user._id };
    }

    const orders = await db.collection('orders').find(query).toArray();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getSingleOrder(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must login to view this order.' });
    }

    const db = getDb();
    let query = { _id: new ObjectId(req.params.id) };

    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const order = await db.collection('orders').findOne(query);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function createOrder(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must login to create an order.' });
    }

    const db = getDb();

    const newOrder = {
      userId: req.user._id,
      customerName: req.user.name,
      orderDate: new Date().toISOString(),
      status:
        req.user.role === 'admin' ? req.body.status || 'pending' : 'pending',
      items: req.body.items,
      totalPrice: req.body.totalPrice,
    };

    const response = await db.collection('orders').insertOne(newOrder);

    if (response.acknowledged) {
      res.status(201).json({
        message: 'Order created successfully',
        orderId: response.insertedId,
      });
    } else {
      res.status(500).json({ message: 'Order creation failed.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function updateOrder(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must login to update orders.' });
    }

    const db = getDb();
    const orderId = req.params.id;
    let query = { _id: new ObjectId(orderId) };

    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const currentOrder = await db.collection('orders').findOne(query);
    if (!currentOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const updatedFields = {};

    if (req.user.role === 'admin') {
      if (req.body.status) updatedFields.status = req.body.status;
      if (req.body.items) updatedFields.items = req.body.items;
      if (req.body.totalPrice) updatedFields.totalPrice = req.body.totalPrice;
    } else {
      if (req.body.status === 'cancelled') {
        if (currentOrder.status !== 'pending') {
          return res.status(400).json({
            message: 'You can only cancel orders that are still pending.',
          });
        }
        updatedFields.status = 'cancelled';
      } else {
        return res.status(403).json({
          message: 'Access denied. Customers can only cancel pending orders.',
        });
      }
    }

    const response = await db
      .collection('orders')
      .updateOne(query, { $set: updatedFields });

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(200).json({ message: 'No changes were made to the order.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteOrder(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must login to delete orders.' });
    }

    const db = getDb();
    const orderId = req.params.id;
    let query = { _id: new ObjectId(orderId) };

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message:
          'Access denied. Only administrators can delete orders from database.',
      });
    }

    const response = await db.collection('orders').deleteOne(query);

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
