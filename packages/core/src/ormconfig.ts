import { Draft } from './entities/draft.entity';
import { TvShow } from './entities/tv-show.entity';
// this will take parameters from the container (e.g. process.env)
export const ormconfig: any = {
  type: 'mongodb',
  host: 'localhost',
  port: '27017',
  database: 'comingsoonseries',
  username: 'attilietto',
  // really don't want my db password here
  password: encodeURIComponent('w&37Vom8LNGmr#76'),
  synchronize: true,
  logging: false,
  entities: [TvShow, Draft],
};
