import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';
import sendResponse from '../../helpers/sendResponse';
import merchandiseService from '../services/merchandiseService';
import categoryService from '../services/categoryService';
import QueryBuilder from '../services/queryService';

export class MerchandiseController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      // @ts-ignore
      body.urls = req.files?.map(image => image.location);
      // @ts-ignore
      if (!body.urls?.length) {
        throw new APIError({
          message: 'No image was uploaded',
          status: httpStatus.BAD_REQUEST,
        });
      }
      // @ts-ignore
      body.tags = body.tags || [];

      //artist ,
      const category = await categoryService.getById(body.category);
      if (!category) {
        throw new APIError({
          message: 'Category does not exit',
          status: httpStatus.BAD_REQUEST,
        });
      }

      const merchandise = await merchandiseService.create(body);
      res.json(sendResponse(httpStatus.CREATED, 'Merchandise created', merchandise));
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Impliment search
      const query = new QueryBuilder(req.query).build();

      /**
       const search = req.query
       */
      const merchandise = await merchandiseService.getAll({ ...query });
      res.json(sendResponse(200, 'Merchandise found', merchandise));
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const merchandise = await merchandiseService.getById(id);
      if (!merchandise) {
        throw new APIError({
          message: 'Merchandise not found',
          status: httpStatus.NOT_FOUND,
        });
      }
      res.status(200).json(sendResponse(200, 'Merchandise found', merchandise));
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = req.body;
      const merchandiseExist = await merchandiseService.getById(id);
      if (!merchandiseExist) {
        throw new APIError({
          message: 'Merchandise does not exist',
          status: httpStatus.NOT_FOUND,
        });
      }
      // checks for
      //category,
      if (data.category) {
        const category = await categoryService.getById(data.category);
        if (!category) {
          throw new APIError({
            message: 'Category does not exit',
            status: httpStatus.BAD_REQUEST,
          });
        }
      }

      const merchandise = await merchandiseService.update(id, data);
      res
        .status(200)
        .json(sendResponse(200, 'Merchandise information updated', merchandise));
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const merchandiseExist = await merchandiseService.getById(id);
      if (!merchandiseExist) {
        throw new APIError({
          message: 'Merchandise does not exist',
          status: httpStatus.NOT_FOUND,
        });
      }
      const merchandise = await merchandiseService.update(id, { deleted: true });
      res
        .status(200)
        .json(sendResponse(200, 'Merchandise information delete', merchandise));
    } catch (err) {
      next(
        new APIError({
          message: err.message,
          status: err.status,
        })
      );
    }
  }
}

export default new MerchandiseController();
