import { Application } from 'express';
import healthRouter from './healthRoute';
import forgotPasswordRouter from './forgot-password';
import userRouter from './userRoutes';
import authRouter from './authRoutes';
import searchRouter from './searchRoutes';
import merchandiseRouter from './merchandiseRoutes';

export default function routes(app: Application): void {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/health-check', healthRouter);
  app.use('/api/v1/forgot-password', forgotPasswordRouter);
  app.use('/api/v1/health-check', healthRouter);
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1/search', searchRouter);
  app.use('/api/v1/merchandise', merchandiseRouter);
}
