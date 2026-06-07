import { getDb } from '../db/connect.js';
import { ObjectId } from 'mongodb';

export async function getAllOrders(req, res) {
  try {
    const db = getDb();
    const orders = await db.collection('orders').find().toArray();

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getSingleOrders(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const location = await db
      .collection('orders')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!location) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function createOrder(req, res) {
  try {
    const db = getDb();

    const newOrder = {
      _id: req.body.id,
      customerName: req.body.customerName,
      orderDate: new Date().toISOString().split('T')[0],
      status: "Pending",
      items: req.body.items,
      totalPrice: req.body.totalPrice
    };

    const response = await db.collection('orders').insertOne(newOrder);

    if (response.acknowledged) {
      res.status(201).json({ 
        message: 'Order created successfully.', 
        orderId: response.insertedId 
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
    const db = getDb();
    const orderId = req.params.id;

    const updatedOrder = {
      customerName: req.body.customerName,
      orderDate: req.body.orderDate,
      status: req.body.status, 
      items: req.body.items,
      totalPrice: req.body.totalPrice
    };

    const response = await db
      .collection('orders')
      .updateOne({ _id: orderId }, { $set: updatedOrder });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

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

    const db = getDb();
    const response = await db
      .collection('orders')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
