import { Observable, from, concat, fromEvent, throwError } from 'rxjs';
import * as fs from 'fs';
import * as fsObs from 'observable-fs';

import { TvShowRepository } from '@comingsoonseries/core/repositories';
import { TvShowDTO } from '@comingsoonseries/core/models';

import {
  filter,
  find,
  switchMap,
  map,
  tap,
  delay,
  catchError,
  finalize,
  takeUntil,
  share,
} from 'rxjs/operators';
import { config } from '../conf/config';
import { Injectable } from '@nestjs/common';

const source_data_files_map = {
  TV_SERIES_BASIC: 'title.basics.tsv',
  TV_SERIES_RATING: 'title.ratings.tsv',
  TV_SERIES_REGION: 'title.akas.tsv',
  TV_SERIES_DIRECTOR: 'title.akas.tsv',
};

@Injectable()
export class TvShowLoaderService {
  //private _tvShowRepository: TvShowRepository;
  static readonly root = `${config.source_data_path}`;
  private dtosMap: { [tconst: string]: TvShowDTO } = {};

  constructor(private readonly _tvShowRepository: TvShowRepository) {}

  load(): void {
    concat(
      this.buildDTOs(this.getSourceFileNames()),
      // concat has a sort of bug, can't concat the db loading here
    ).subscribe({
      error: err =>
        console.log(`there was an error during the process: ${err}`),
      complete: async () => {
        console.log(`step completed`);
        const dtos: TvShowDTO[] = Object.values(this.dtosMap);
        const chunkSize = 1000;

        await new Promise(async (resolve, reject) => {
          for (let i = 0; i < dtos.length; i++) {
            await this._tvShowRepository.load(
              dtos.slice(i * chunkSize, (i + 1) * chunkSize - 1),
            );
          }
          resolve();
        });
        console.log('process completed');
        process.exit(0);
        // .subscribe(noop, noop, () => console.log("completed too"));
      },
    });
  }

  loadTvShows(names$: Observable<string>): Observable<any> {
    const { onData$, onEnd$, onError$ } = this.getStreamAsCallbacks(
      names$,
      source_data_files_map.TV_SERIES_BASIC,
    );

    return onData$.pipe(
      map((data: Buffer) => data.toString().split(/(?:\r\n|\r|\n)/g)),
      switchMap((entries: string[]) => from(entries)),
      filter((entry: string) => entry.split('\t')[1] === 'tvSeries'),
      map((entry: string) => this.getTvShowDTO(entry)),
      tap((dto: TvShowDTO) => (this.dtosMap[dto.tconst] = dto)),
      takeUntil(onEnd$),
      takeUntil(onError$),
      catchError(err => throwError(err)),
      finalize(() => console.log('load tv show completed')),
    );
  }

  addRatings(names$: Observable<string>): Observable<any> {
    const { onData$, onEnd$, onError$ } = this.getStreamAsCallbacks(
      names$,
      source_data_files_map.TV_SERIES_RATING,
    );

    return onData$.pipe(
      map((data: Buffer) => data.toString().split(/(?:\r\n|\r|\n)/g)),
      switchMap((entries: string[]) => from(entries)), //switchMap((entries: string[]) => from(entries)),
      tap(this.addRatingsToDTO.bind(this)),
      takeUntil(onEnd$),
      takeUntil(onError$),
      catchError(err => throwError(err)),
      finalize(() => console.log('addRatings completed')),
    );
  }

  addCountry(names$: Observable<string>): Observable<any> {
    const { onData$, onEnd$, onError$ } = this.getStreamAsCallbacks(
      names$,
      source_data_files_map.TV_SERIES_REGION,
    );

    return onData$.pipe(
      map((data: Buffer) => data.toString().split(/(?:\r\n|\r|\n)/g)),
      switchMap((entries: string[]) => from(entries)), //switchMap((entries: string[]) => from(entries)),
      tap(this.addCountryToDTO.bind(this)),
      takeUntil(onEnd$),
      takeUntil(onError$),
      catchError(err => throwError(err)),
      finalize(() => console.log('addCountry completed')),
    );
  }

  getSourceFileNames(): Observable<string> {
    return fsObs
      .filesObs(TvShowLoaderService.root)
      .pipe(filter(fname => /(.)*(\.tsv)$/g.test(fname)));
  }

  private getStreamAsCallbacks(names$: Observable<string>, name: string): any {
    const readStream$ = names$.pipe(
      find(fname => fname.indexOf(name) !== -1),
      tap(fname => console.log(`read from ${fname}`)),
      delay(2000),
      map(fname => fs.createReadStream(fname)),
    );
    const sharedFileStream$ = readStream$.pipe(share());
    const onEnd$ = sharedFileStream$.pipe(
      switchMap((stream: fs.ReadStream) => fromEvent<void>(stream, 'end')),
      tap(() => console.log('stream end')),
    );
    const onError$ = sharedFileStream$.pipe(
      switchMap((stream: fs.ReadStream) => fromEvent<void>(stream, 'error')),
      tap(e => console.log('stream error: ', e)),
    );
    const onData$ = sharedFileStream$.pipe(
      switchMap((stream: fs.ReadStream) => fromEvent<Buffer>(stream, 'data')),
    );

    return { onData$, onEnd$, onError$ };
  }

  // TODO: improve this project please maybe with a library for parsing tsv
  private getTvShowDTO(entry: string): TvShowDTO {
    const dto: TvShowDTO = {};

    entry.split('\t').forEach((field, idx) => {
      if (idx === 0) {
        dto.tconst = field;
      } else if (idx === 1) {
        dto.titleType = field;
      } else if (idx === 3) {
        dto.primaryTitle = field;
      } else if (idx === 4) {
        dto.isAdult = field === '0' ? false : true;
      } else if (idx === 5) {
        dto.startYear = field;
      } else if (idx === 6) {
        dto.endYear = field;
      } else if (idx === 7) {
        dto.runtimeMinutes = +field;
      } else if (idx === 8) {
        dto.genres = field.indexOf(',') !== -1 ? field.split(',') : [field];
      }
    });

    return dto;
  }

  // build DTOs
  private buildDTOs(names$: Observable<string>): Observable<void> {
    return concat(
      this.loadTvShows(names$),
      this.addRatings(names$),
      this.addCountry(names$),
    );
  }

  private addRatingsToDTO(entry: string): void {
    const fields: string[] = entry.split('\t');
    const dto: TvShowDTO = this.dtosMap[fields[0]];

    if (dto) {
      dto.imdb_average_rank = fields[1] ? +fields[1] : -1;
      dto.imdb_num_votes = fields[2] ? +fields[2] : -1;
    }
  }

  private addCountryToDTO(entry: string): void {
    const fields: string[] = entry.split('\t');
    const dto: TvShowDTO = this.dtosMap[fields[0]];

    if (dto) {
      dto.country = fields[3] || '';
    }
  }
}
