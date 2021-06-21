import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../helpers/sendResponse';

export class SongController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      let warning = [];
      const body = req.body;
      // @ts-ignore
      body.URL = req.files.audio[0].key;
      // @ts-ignore
      body.previewURL = req.files.preview[0].key;
      // @ts-ignore
      body.art = req.files.art[0]?.key;
      body.tags = body.tags;
      body.collaborators = body.collaborators;
      body.featured = body.featured;
      // checks for
      //artist,


      //genre
    
      //and album


      res.json(sendResponse(httpStatus.CREATED, 'Song created'));
    } catch (err) {
      next(err);
    }
  }
}



export default new SongController();
