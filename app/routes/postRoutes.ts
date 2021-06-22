import express from 'express';
import { celebrate } from 'celebrate';
import postCtrl from '../controller/postController';
import { create, update } from '../validation/postValidation';
import upload from '../../helpers/upload';
import decode from '../middleware/decode';
import { TokenType } from '../services/tokenService';

const router = express.Router();

router.use(decode(TokenType.AUTH))
router
  .route('/')
  .get(postCtrl.getAll)
  .post(
    upload('image').array('image'),
    celebrate(create, { abortEarly: false }),
    postCtrl.create
  );

router
  .route('/:id')
  .get(postCtrl.getOne)
  .put(
    upload('image').array('image'),
    celebrate(update, { abortEarly: false }), postCtrl.update) // consider file upload
  .delete( postCtrl.delete);
router
  .route('/:id/reply')
  .get(postCtrl.getOne)
  .put(
    upload('image').array('image'),
    celebrate(update, { abortEarly: false }), postCtrl.update) // consider file upload
  .delete( postCtrl.delete);

export default router;
