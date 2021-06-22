import { Query } from 'express-serve-static-core';

export interface IQuery extends Query {
  genre: string;
  artist: string;
  album: string;
  tags: string;
  sort: string;
  limit: string;
  skip: string;
  s: string;
}
export interface IQueryResult {
  genre: string;
  artist: string;
  album: string;
  tags: string;
  sort: string;
  limit: number;
  skip: number;
  s: string;
}

interface Builder {
  query: Partial<IQuery>;
  sort: () => { sort: string };
  limit: () => { limit: number };
  s: () => { s: string };
}

export default class QueryBuilder implements Builder {
  [x: string]: any;
  query: Partial<IQuery>;

  constructor(query: Partial<IQuery>) {
    if (typeof query !== 'object') {
      throw new Error('Query must be of object');
    }
    this.query = query;
  }
  limit() {
    return { limit: +this.query.limit! };
  }
  sort() {
    return { sort: this.query.sort! };
  }
  skip() {
    return { skip: +this.query.skip! };
  }

  s() {
    return { s: this.query.s! };
  }
  build(): Partial<IQueryResult> {
    let query = {};
    for (let key in this.query) {
      query = { ...query, ...this[key]() };
    }
    return query;
  }
}
