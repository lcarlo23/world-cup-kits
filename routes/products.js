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
import { isAdmin, isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);

router.post(
  '/',
  isAuthenticated,
  isAdmin,
  productValidationRules(),
  checkValidation,
  createProduct,
);
router.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  productValidationRules(),
  checkValidation,
  updateProduct,
);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

export default router;
