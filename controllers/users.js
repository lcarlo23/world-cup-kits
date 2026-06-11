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

    const db = getDb();
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
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
    const userId = new ObjectId(req.params.id);

    const updatedUser = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      provider: req.body.provider,
      providerId: req.body.providerId,
    };

    const response = await db
      .collection('users')
      .updateOne({ _id: userId }, { $set: updatedUser });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(200).json({ message: 'No changes were made to the user.' });
    }
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
    const response = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
