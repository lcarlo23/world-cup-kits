import express from 'express';
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.js';
import {
  productValidationRules,
  checkValidation,
} from '../middleware/validate.js';
import { isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.post(
  '/',
  isAuthenticated,
  productValidationRules(),
  checkValidation,
  createProduct,
);
router.put(
  '/:id',
  isAuthenticated,
  productValidationRules(),
  checkValidation,
  updateProduct,
);
router.delete('/:id', isAuthenticated, deleteProduct);

export default router;
