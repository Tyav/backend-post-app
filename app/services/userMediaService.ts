// import { s3 } from '../../helpers/upload';
// import downloader from 's3-download-stream';
import { UserMedia, IUserMedia } from '../model/userMediaModel';
// import { IQueryResult } from './queryService';

// interface IUserMediaQuery extends IUserMedia {}

export class UserMediaService {
  /**
   * @description Creates an song
   */
  async create(body: Partial<IUserMedia>): Promise<IUserMedia> {
    const image = new UserMedia(body);
    return image.save();
  }
}

export default new UserMediaService();
