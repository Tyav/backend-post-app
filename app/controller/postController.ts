import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';
import sendResponse from '../../helpers/sendResponse';
import postService from '../services/postService';
import QueryBuilder from '../services/queryService';
import userMediaService from '../services/userMediaService';
import { IRequest } from '../types/express';

export class PostController {
  async create(req: IRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const user = req.sub!;
      body.images = []
      body.user = user;
      
      // @ts-ignore
      for (let i = 0; i < req.files.length; i++) {
        // @ts-ignore
        let image = await userMediaService.create({ user, url: req.files[i].location })
        body.images[i] = image._id
      }
      // @ts-ignore
      body.tags = body.tags || [];

      const post = await postService.create(body);
      res.json(sendResponse(httpStatus.CREATED, 'Post created', post));
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
      const post = await postService.getAll({ ...query });
      res.json(sendResponse(200, 'Post found', post));
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const post = await postService.getById(id);
      if (!post) {
        throw new APIError({
          message: 'Post not found',
          status: httpStatus.NOT_FOUND,
        });
      }
      res.status(200).json(sendResponse(200, 'Post found', post));
    } catch (err) {
      next(err);
    }
  }

  async update(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const user = req.sub
      const data = req.body;
      const postExist = await postService.getById(id);
      if (!postExist) {
        throw new APIError({
          message: 'Post does not exist',
          status: httpStatus.NOT_FOUND,
        });
      }
      
      data.images = [];
      // @ts-ignore
      for (let i = 0; i < req.files.length; i++) {
        // @ts-ignore
        let image = await userMediaService.create({ user, url: req.files[i].location })
        data.images[i] = image._id
      }
      data.images = data.images.concat(postExist.images)
      const post = await postService.update(id, data);
      res
        .status(200)
        .json(sendResponse(200, 'Post information updated', post));
    } catch (err) {
      next(err);
    }
  }

  async delete(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const sub = req.sub!
      const postExist = await postService.getById(id);
      if (!postExist || postExist.user !== sub) {
        throw new APIError({
          message: 'Post does not exist',
          status: httpStatus.NOT_FOUND,
        });
      }
      const post = await postService.delete(id);
      res
        .status(200)
        .json(sendResponse(200, 'Post information delete', post));
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

export default new PostController();
