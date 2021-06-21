import express from 'express';
import controller from '../controller/healthController';
const router = express.Router();

router.get('/', controller.checkHealth);

export default router;
