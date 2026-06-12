import express from 'express';
import {
  getAllReviews,
  getSingleReview,
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviews.js';
import {
  reviewValidationRules,
  checkValidation,
} from '../middleware/validate.js';
import { isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', getAllReviews);
router.get('/:id', getSingleReview);

router.get('/product/:productId', getReviewsByProduct);

router.post(
  '/',
  isAuthenticated,
  reviewValidationRules(),
  checkValidation,
  createReview,
);
router.put(
  '/:id',
  isAuthenticated,
  reviewValidationRules(),
  checkValidation,
  updateReview,
);
router.delete('/:id', isAuthenticated, deleteReview);

export default router;
