import { Entity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import { Product } from '../models';

@Entity()
export class TvShow {
  @ObjectIdColumn({ name: '_id' })
  id: ObjectID;

  @Column()
  title: string;

  @Column()
  imdb_id: string;

  @Column()
  release_year: string;

  @Column()
  genres: string[];

  @Column()
  minutes: number;

  @Column()
  isAdult: boolean;

  @Column()
  imdb_average_rank: number;

  @Column()
  imdb_num_votes: number;

  @Column()
  country: string;

  @Column()
  next_release_date: Date;

  @Column()
  trailer: string;

  @Column()
  plot: string;

  @Column()
  poster: string;

  @Column()
  cover: string;

  @Column()
  networks: string[];

  @Column()
  directors: string[];

  @Column(type => Product)
  products: Product[];

  @Column()
  countLists: number;
}
