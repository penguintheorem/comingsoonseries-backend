import { TvShow } from './tv-show.entity';
import { Entity, ObjectIdColumn, Column, ObjectID } from 'typeorm';

@Entity()
export class Draft {
  @ObjectIdColumn({ name: '_id' })
  id: ObjectID;

  @Column()
  title: string;

  @Column()
  lastUpdateDate: Date;

  @Column(type => TvShow)
  tvShow: TvShow;
}
