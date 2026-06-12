import { getDb } from '../db/connect.js';
import { ObjectId } from 'mongodb';

export async function getAllReviews(req, res) {
  try {
    const db = getDb();
    const reviews = await db.collection('reviews').find().toArray();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getSingleReview(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const review = await db
      .collection('reviews')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function createReview(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must login to leave a review.' });
    }

    const db = getDb();

    const productExists = await db
      .collection('products')
      .findOne({ _id: new ObjectId(req.body.productId) });
    if (!productExists) {
      return res
        .status(404)
        .json({ message: 'The product you want to review does not exist.' });
    }

    const newReview = {
      userId: req.user._id,
      reviewerName: req.user.name,
      productId: new ObjectId(req.body.productId),
      rating: Number(req.body.rating),
      comment: req.body.comment,
      reviewDate: new Date().toISOString(),
    };

    const response = await db.collection('reviews').insertOne(newReview);

    if (response.acknowledged) {
      res.status(201).json({
        message: 'Review added successfully',
        reviewId: response.insertedId,
      });
    } else {
      res.status(500).json({ message: 'Review creation failed.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getReviewsByProduct(req, res) {
  try {
    if (!ObjectId.isValid(req.params.productId)) {
      return res.status(400).json({ message: 'Invalid Product ID format.' });
    }

    const db = getDb();
    const productId = req.params.productId;

    const reviews = await db
      .collection('reviews')
      .find({ productId: new ObjectId(productId) })
      .toArray();

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function updateReview(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must login to update a review.' });
    }

    const db = getDb();
    const reviewId = req.params.id;

    let query = { _id: new ObjectId(reviewId) };

    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const updatedReview = {
      rating: Number(req.body.rating),
      comment: req.body.comment,
      lastEdited: new Date().toISOString(),
    };

    const response = await db
      .collection('reviews')
      .updateOne(query, { $set: updatedReview });

    if (response.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: 'Review not found or access denied.' });
    }

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(200).json({ message: 'No changes were made to the review.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteReview(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must login to delete a review.' });
    }

    const db = getDb();
    const reviewId = req.params.id;

    let query = { _id: new ObjectId(reviewId) };

    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const response = await db.collection('reviews').deleteOne(query);

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Review not found or access denied.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
