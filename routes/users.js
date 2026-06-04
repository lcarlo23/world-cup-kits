import express from 'express';
import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.js';
import {
  userValidationRules,
  checkValidation,
} from '../middleware/validate.js';
import { isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getSingleUser);
router.post(
  '/',
  isAuthenticated,
  userValidationRules(),
  checkValidation,
  createUser,
);
router.put(
  '/:id',
  isAuthenticated,
  userValidationRules(),
  checkValidation,
  updateUser,
);
router.delete('/:id', isAuthenticated, deleteUser);

export default router;
