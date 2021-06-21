import express from 'express';
import { celebrate } from 'celebrate';

import authCtrl from '../controller/accountVerificationControler';
import { verify } from '../validation/authValidation';
import decode from '../middleware/decode';
import { TokenType } from '../services/tokenService';

const router = express.Router();

router
  .route('/verify')
  /**  Sign up a retailer */
  .put(
    celebrate(verify, { abortEarly: false }),
    decode(TokenType.VERIFY),
    authCtrl.verify
  );

export default router;
