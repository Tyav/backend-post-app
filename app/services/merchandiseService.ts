import { Merchandise, IMerchandise } from '../model/merchandiseModel';
import { IQueryResult } from './queryService';

export class MerchandiseService {
  /**
   * @description Creates a merchandise
   */
  async create(body: IMerchandise): Promise<IMerchandise> {
    const merchandise = new Merchandise(body);
    return merchandise.save();
  }

  /**
   * @description get all Merchandise
   */
  async get(body: Partial<IMerchandise>): Promise<IMerchandise | null> {
    const merchandise = await Merchandise.findOne({ 
      // ...body, 
      deleted: false 
    });
    return merchandise;
  }

  /**
   * @description get a Merchandise by Id
   */
  async getById(_id: String): Promise<IMerchandise | null> {
    const merchandise = await Merchandise.findOne({ _id, deleted: false });
    return merchandise;
  }
  /**
   * @description get a Merchandise by Id
   */
  async getAll({
    skip,
    limit,
    sort,
    ...body
  }: Partial<IQueryResult>): Promise<IMerchandise[]> {
    const merchandises = await Merchandise.find({
      ...body,
      deleted: false,
    })
      .limit(limit || 20)
      .skip(skip || 0)
      .sort(sort);
    return merchandises;
  }

  /**
   * @description delete a Merchandise by Id
   */
  async update(
    id: String,
    data: Partial<IMerchandise>
  ): Promise<IMerchandise | null> {
    const merchandise = await Merchandise.findByIdAndUpdate(
      id,
      {
        $set: {
          ...data,
        },
      },
      { new: true }
    );
    return merchandise;
  }

  // getBuffer(key: string) {
  //   return downloader({
  //     client: s3,
  //     params: {
  //       Key: key,
  //       Bucket: 'testbuck-ond',
  //     },
  //   });
  //   // return s3.getObject({
  //   //   Key: key,
  //   //   Bucket: "testbuck-ond"
  //   // })
  // }

  // async search(search: string) {
  //   const searchRegexp = new RegExp(search, 'ig');
  //   const merchandises = await Merchandise.find({ deleted: false })
  //     .or([
  //       { title: searchRegexp },
  //       { composer: searchRegexp },
  //       { collaborators: searchRegexp },
  //       { featured: searchRegexp },
  //       { tags: searchRegexp },
  //     ])
  //     .limit(20);
  //   return merchandises;
  // }
}

export default new MerchandiseService();
