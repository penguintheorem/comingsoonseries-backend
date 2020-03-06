import { ObjectID } from 'typeorm';
import { Product } from '../models';
export declare class TvShow {
    id: ObjectID;
    title: string;
    imdb_id: string;
    release_year: string;
    genres: string[];
    minutes: number;
    isAdult: boolean;
    imdb_average_rank: number;
    imdb_num_votes: number;
    country: string;
    next_release_date: Date;
    trailer: string;
    plot: string;
    poster: string;
    cover: string;
    networks: string[];
    directors: string[];
    products: Product[];
    countLists: number;
}
