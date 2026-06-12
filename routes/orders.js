import express from 'express';
import {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orders.js';
import {
  orderValidationRules,
  checkValidation,
} from '../middleware/validate.js';
import { isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', isAuthenticated, getAllOrders);
router.get('/:id', isAuthenticated, getSingleOrder);
router.post(
  '/',
  isAuthenticated,
  orderValidationRules(),
  checkValidation,
  createOrder,
);
router.put(
  '/:id',
  isAuthenticated,
  orderValidationRules(),
  checkValidation,
  updateOrder,
);
router.delete('/:id', isAuthenticated, deleteOrder);

export default router;
