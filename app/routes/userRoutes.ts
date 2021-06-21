import express from 'express';
import { celebrate } from 'celebrate';

import userCtrl from '../controller/userController';
import { create, login } from '../validation/userValidation';

const router = express.Router();

router
  .route('/')
  /**  Sign up a user */
  .post(celebrate(create, { abortEarly: false }), userCtrl.create);

/**  login a user */
router.post('/login', celebrate(login, { abortEarly: false }), userCtrl.login);
export default router;
