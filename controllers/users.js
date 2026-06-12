import { getDb } from '../db/connect.js';
import { ObjectId } from 'mongodb';

export async function getAllUsers(req, res) {
  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getSingleUser(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must login to get this profile.' });
    }

    const db = getDb();
    const targetUserId = new ObjectId(req.params.id);

    if (
      req.user?.role !== 'admin' &&
      req.user._id.toString() !== targetUserId.toString()
    ) {
      return res.status(403).json({
        message: 'Access denied. You can only view your own profile.',
      });
    }

    let query = { _id: targetUserId };

    if (req.user?.role !== 'admin') {
      query._id = req.user._id;
    }

    const user = await db.collection('users').findOne(query);

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found or access denied.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function createUser(req, res) {
  try {
    const db = getDb();
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      provider: req.body.provider,
      providerId: req.body.providerId,
    };

    const response = await db.collection('users').insertOne(newUser);

    if (response.acknowledged) {
      res.status(201).json({
        message: 'User created successfully',
        userId: response.insertedId,
      });
    } else {
      res.status(500).json({ message: 'Creation failed.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function updateUser(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();

    const updatedFields = {
      name: req.body.name,
      email: req.body.email,
      provider: req.body.provider,
      providerId: req.body.providerId,
    };

    if (req.user?.role === 'admin') {
      updatedFields.role = req.body.role;
    }

    let filter = { _id: new ObjectId(req.params.id) };

    if (req.user?.role !== 'admin') {
      filter._id = req.user._id;
    }

    const response = await db
      .collection('users')
      .updateOne(filter, { $set: updatedFields });

    if (response.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: 'User not found or permission denied.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const targetUserId = new ObjectId(req.params.id);

    let filter = { _id: targetUserId };

    if (req.user?.role !== 'admin') {
      filter._id = req.user._id;
    }

    const response = await db.collection('users').deleteOne(filter);

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found or permission denied.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
