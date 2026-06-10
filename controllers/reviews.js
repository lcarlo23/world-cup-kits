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
    const db = getDb();

    const newReview = {
      productName: req.body.productName,
      reviewerName: req.body.reviewerName,
      rating: Number(req.body.rating), 
      comment: req.body.comment,
      reviewDate: new Date().toISOString().split('T')[0] 
        };

    const response = await db.collection('reviews').insertOne(newReview);

    if (response.acknowledged) {
      res.status(201).json({ 
        message: 'Review created successfully.', 
        reviewId: response.insertedId 
      });
    } else {
      res.status(500).json({ message: 'Review creation failed.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function updateReview(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const reviewId = req.params.id;

    const updatedReview = {
      productName: req.body.productName,
      reviewerName: req.body.reviewerName,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      reviewDate: req.body.reviewDate
    };

    const response = await db
      .collection('reviews')
      .updateOne({ _id: new ObjectId(reviewId) }, { $set: updatedReview });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Review not found.' });
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

    const db = getDb();
    const response = await db
      .collection('reviews')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Review not found.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
