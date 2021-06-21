import { Router } from 'express';
import { celebrate } from 'celebrate';

import { ForgotPasswordController } from '../controller/forgot-password';
import { forgotPasswordValidation, resetPasswordValidation } from '../validation/forgot-password';
import decode from '../middleware/decode';
import { TokenType } from '../services/tokenService';

const router = Router({ mergeParams: true });

router.post(
  '/',
  celebrate(forgotPasswordValidation, { abortEarly: true }),
  ForgotPasswordController.handler
);
router.post('/verify', ForgotPasswordController.verify)
router.post('/reset', celebrate( resetPasswordValidation, { abortEarly: true }), decode(TokenType.PASSWORD_RESET), ForgotPasswordController.reset)

export default router;
