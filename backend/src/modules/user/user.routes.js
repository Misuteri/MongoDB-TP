// user.routes.js: Routes definitions for user resource
import { Router } from 'express';
import { validateBody } from '../middlewares/validateSchema.js';
import { createUserSchema, updateUserSchema } from './user.schema.js';
import {
  createUserController,
  listUsersController,
  getUserController,
  updateUserController,
  deleteUserController,
} from './user.controller.js';

const router = Router();

router.get('/', listUsersController);
router.post('/', validateBody(createUserSchema), createUserController);
router.get('/:id', getUserController);
router.put('/:id', validateBody(updateUserSchema), updateUserController);
router.delete('/:id', deleteUserController);

export default router;


