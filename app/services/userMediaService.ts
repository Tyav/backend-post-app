import { s3 } from '../../helpers/upload';
import downloader from 's3-download-stream';
import { UserMedia, IUserMedia } from '../model/userMediaModel';
import { IQueryResult } from './queryService';

// interface IUserMediaQuery extends IUserMedia {}

export class UserMediaService {
  /**
   * @description Creates an song
   */
  async create(body: IUserMedia): Promise<IUserMedia> {
    const song = new UserMedia(body);
    return song.save();
  }

  /**
   * @description get an UserMedia by Id
   */
  async get(body: Partial<IUserMedia>): Promise<IUserMedia | null> {
    const song = await UserMedia.findOne({ ...body, deleted: false });
    return song;
  }

  /**
   * @description get an UserMedia by Id
   */
  async getById(_id: String): Promise<IUserMedia | null> {
    const song = await UserMedia.findOne({ _id, deleted: false });
    return song;
  }
  /**
   * @description get an UserMedia by Id
   */
  async getAll({
    skip,
    limit,
    sort,
    ...body
  }: Partial<IQueryResult>): Promise<IUserMedia[]> {
    const songs = await UserMedia.find(({
      ...body,
      deleted: false,
    } as unknown) as IUserMedia)
      .limit(limit || 20)
      .skip(skip || 0)
      .sort(sort);
    return songs;
  }

  /**
   * @description delete an UserMedia by Id
   */
  async update(id: String, data: Partial<IUserMedia>): Promise<IUserMedia | null> {
    const song = await UserMedia.findByIdAndUpdate(
      id,
      {
        $set: {
          ...data,
        },
      },
      { new: true }
    );
    return song;
  }

  getBuffer(key: string) {
    return downloader({
      client: s3,
      params: {
        Key: key,
        Bucket: 'testbuck-ond',
      },
    });
    // return s3.getObject({
    //   Key: key,
    //   Bucket: "testbuck-ond"
    // })
  }

  async search(search: string) {
    const searchRegexp = new RegExp(search, 'ig');
    const songs = await UserMedia.find({ deleted: false })
      .or([
        { title: searchRegexp },
        { composer: searchRegexp },
        { collaborators: searchRegexp },
        { featured: searchRegexp },
        { tags: searchRegexp },
      ])
      .limit(20);
    return songs;
  }
}

export default new UserMediaService();
