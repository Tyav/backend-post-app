import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';
import sendResponse from '../../helpers/sendResponse';

export class Controller {
  async checkHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const docs = {};
      return res.status(200).json(sendResponse(200, 'Health Okay', docs));
    } catch (err) {
      return next(err);
    }
  }

  async errorExample(_req: Request, _res: Response, next: NextFunction) {
    try {
      throw new APIError({
        message: 'Error: Cast to ObjectId failed',
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default new Controller();
