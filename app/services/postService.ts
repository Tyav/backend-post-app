import { Post, IPost } from '../model/postModel';
import { UserMedia } from '../model/userMediaModel';
import { IQueryResult } from './queryService';

export class PostService {
  /**
   * @description Creates a post
   */
  async create(body: IPost): Promise<IPost> {
    const post = new Post(body);
    return post.save();
  }

  /**
   * @description get all Post
   */
  async get(_body: Partial<IPost>): Promise<IPost | null> {
    const post = await Post.findOne({ 
      //...body, 
      deleted: false 
    });
    return post;
  }

  /**
   * @description get a Post by Id
   */
  async getById(_id: String): Promise<IPost | null> {
    const post = await Post.findOne({ _id, deleted: false });
    return post;
  }
  /**
   * @description get a Post by Id
   */
  async getAll({
    skip,
    limit,
    sort,
    ...body
  }: Partial<IQueryResult>): Promise<IPost[]> {
    const posts = await Post.find({
      ...body,
      deleted: false,
    })
      .limit(limit || 20)
      .skip(skip || 0)
      .sort(sort);
    return posts;
  }

  /**
   * @description update a Post by Id
   */
  async update(
    id: String,
    data: Partial<IPost>
  ): Promise<IPost | null> {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          ...data,
        },
      },
      { new: true }
    );
    return post;
  }
  /**
   * @description delete a Post by Id
   */
  async delete (
    id: String,
  ): Promise<IPost | null> {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          deleted: true,
        },
      },
      { new: true }
    );

    if (post) {
      let imageIds = post.images.map(image => image._id);
      // delete images
      await UserMedia.updateMany({ _id : {
        $in : imageIds
      }}, 
      {
        $set : {
          deleted: true
        }
      })
    }
    return post;
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
  //   const posts = await Post.find({ deleted: false })
  //     .or([
  //       { title: searchRegexp },
  //       { composer: searchRegexp },
  //       { collaborators: searchRegexp },
  //       { featured: searchRegexp },
  //       { tags: searchRegexp },
  //     ])
  //     .limit(20);
  //   return posts;
  // }
}

export default new PostService();
