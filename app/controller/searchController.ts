import { Request, Response, NextFunction } from 'express';
// import httpStatus from 'http-status';
// import APIError from '../../helpers/APIError';
import sendResponse from '../../helpers/sendResponse';
// import songService from '../services/songService';
// import videoService from '../services/videoService';
// import artistService from '../services/artistService';
// import genreService from '../services/genreService';
// import albumService from '../services/albumService';
import QueryBuilder from '../services/queryService';

export class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Impliment search
      const query = new QueryBuilder(req.query).build();

      /**
       const search = req.query
       */

      // const songs = await songService.search(query.s || '');
      // const videos = await videoService.search(query.s || '');
      res.json(sendResponse(200, 'Searchs found', {  }));
    } catch (err) {
      next(err);
    }
  }
}

export default new SearchController();
