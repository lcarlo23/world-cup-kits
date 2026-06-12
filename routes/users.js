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
import { isAdmin, isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', isAuthenticated, isAdmin, getAllUsers);
router.get('/:id', isAuthenticated, getSingleUser);
router.post(
  '/',
  isAuthenticated,
  isAdmin,
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
