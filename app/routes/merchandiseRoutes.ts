import express from 'express';
import { celebrate } from 'celebrate';
import merchandiseCtrl from '../controller/merchandiseController';
import { create, update } from '../validation/merchandiseValidation';
import upload from '../../helpers/upload';

const router = express.Router();

router
  .route('/')
  .get(merchandiseCtrl.getAll)
  .post(
    upload('merchandise').array('image', 4),
    celebrate(create, { abortEarly: false }),
    merchandiseCtrl.create
  );

router
  .route('/:id')
  .get(merchandiseCtrl.getOne)
  .put(celebrate(update, { abortEarly: false }), merchandiseCtrl.update); // consider file upload

export default router;
