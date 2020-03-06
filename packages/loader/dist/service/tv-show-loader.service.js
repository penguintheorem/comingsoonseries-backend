"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var TvShowLoaderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const fs = require("fs");
const fsObs = require("observable-fs");
const repositories_1 = require("@comingsoonseries/core/repositories");
const operators_1 = require("rxjs/operators");
const config_1 = require("../conf/config");
const common_1 = require("@nestjs/common");
const source_data_files_map = {
    TV_SERIES_BASIC: 'title.basics.tsv',
    TV_SERIES_RATING: 'title.ratings.tsv',
    TV_SERIES_REGION: 'title.akas.tsv',
    TV_SERIES_DIRECTOR: 'title.akas.tsv',
};
let TvShowLoaderService = TvShowLoaderService_1 = class TvShowLoaderService {
    constructor(_tvShowRepository) {
        this._tvShowRepository = _tvShowRepository;
        this.dtosMap = {};
    }
    load() {
        rxjs_1.concat(this.buildDTOs(this.getSourceFileNames())).subscribe({
            error: err => console.log(`there was an error during the process: ${err}`),
            complete: () => __awaiter(this, void 0, void 0, function* () {
                console.log(`step completed`);
                const dtos = Object.values(this.dtosMap);
                const chunkSize = 1000;
                yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    for (let i = 0; i < dtos.length; i++) {
                        yield this._tvShowRepository.load(dtos.slice(i * chunkSize, (i + 1) * chunkSize - 1));
                    }
                    resolve();
                }));
                console.log('process completed');
                process.exit(0);
            }),
        });
    }
    loadTvShows(names$) {
        const { onData$, onEnd$, onError$ } = this.getStreamAsCallbacks(names$, source_data_files_map.TV_SERIES_BASIC);
        return onData$.pipe(operators_1.map((data) => data.toString().split(/(?:\r\n|\r|\n)/g)), operators_1.switchMap((entries) => rxjs_1.from(entries)), operators_1.filter((entry) => entry.split('\t')[1] === 'tvSeries'), operators_1.map((entry) => this.getTvShowDTO(entry)), operators_1.tap((dto) => (this.dtosMap[dto.tconst] = dto)), operators_1.takeUntil(onEnd$), operators_1.takeUntil(onError$), operators_1.catchError(err => rxjs_1.throwError(err)), operators_1.finalize(() => console.log('load tv show completed')));
    }
    addRatings(names$) {
        const { onData$, onEnd$, onError$ } = this.getStreamAsCallbacks(names$, source_data_files_map.TV_SERIES_RATING);
        return onData$.pipe(operators_1.map((data) => data.toString().split(/(?:\r\n|\r|\n)/g)), operators_1.switchMap((entries) => rxjs_1.from(entries)), operators_1.tap(this.addRatingsToDTO.bind(this)), operators_1.takeUntil(onEnd$), operators_1.takeUntil(onError$), operators_1.catchError(err => rxjs_1.throwError(err)), operators_1.finalize(() => console.log('addRatings completed')));
    }
    addCountry(names$) {
        const { onData$, onEnd$, onError$ } = this.getStreamAsCallbacks(names$, source_data_files_map.TV_SERIES_REGION);
        return onData$.pipe(operators_1.map((data) => data.toString().split(/(?:\r\n|\r|\n)/g)), operators_1.switchMap((entries) => rxjs_1.from(entries)), operators_1.tap(this.addCountryToDTO.bind(this)), operators_1.takeUntil(onEnd$), operators_1.takeUntil(onError$), operators_1.catchError(err => rxjs_1.throwError(err)), operators_1.finalize(() => console.log('addCountry completed')));
    }
    getSourceFileNames() {
        return fsObs
            .filesObs(TvShowLoaderService_1.root)
            .pipe(operators_1.filter(fname => /(.)*(\.tsv)$/g.test(fname)));
    }
    getStreamAsCallbacks(names$, name) {
        const readStream$ = names$.pipe(operators_1.find(fname => fname.indexOf(name) !== -1), operators_1.tap(fname => console.log(`read from ${fname}`)), operators_1.delay(2000), operators_1.map(fname => fs.createReadStream(fname)));
        const sharedFileStream$ = readStream$.pipe(operators_1.share());
        const onEnd$ = sharedFileStream$.pipe(operators_1.switchMap((stream) => rxjs_1.fromEvent(stream, 'end')), operators_1.tap(() => console.log('stream end')));
        const onError$ = sharedFileStream$.pipe(operators_1.switchMap((stream) => rxjs_1.fromEvent(stream, 'error')), operators_1.tap(e => console.log('stream error: ', e)));
        const onData$ = sharedFileStream$.pipe(operators_1.switchMap((stream) => rxjs_1.fromEvent(stream, 'data')));
        return { onData$, onEnd$, onError$ };
    }
    getTvShowDTO(entry) {
        const dto = {};
        entry.split('\t').forEach((field, idx) => {
            if (idx === 0) {
                dto.tconst = field;
            }
            else if (idx === 1) {
                dto.titleType = field;
            }
            else if (idx === 3) {
                dto.primaryTitle = field;
            }
            else if (idx === 4) {
                dto.isAdult = field === '0' ? false : true;
            }
            else if (idx === 5) {
                dto.startYear = field;
            }
            else if (idx === 6) {
                dto.endYear = field;
            }
            else if (idx === 7) {
                dto.runtimeMinutes = +field;
            }
            else if (idx === 8) {
                dto.genres = field.indexOf(',') !== -1 ? field.split(',') : [field];
            }
        });
        return dto;
    }
    buildDTOs(names$) {
        return rxjs_1.concat(this.loadTvShows(names$), this.addRatings(names$), this.addCountry(names$));
    }
    addRatingsToDTO(entry) {
        const fields = entry.split('\t');
        const dto = this.dtosMap[fields[0]];
        if (dto) {
            dto.imdb_average_rank = fields[1] ? +fields[1] : -1;
            dto.imdb_num_votes = fields[2] ? +fields[2] : -1;
        }
    }
    addCountryToDTO(entry) {
        const fields = entry.split('\t');
        const dto = this.dtosMap[fields[0]];
        if (dto) {
            dto.country = fields[3] || '';
        }
    }
};
TvShowLoaderService.root = `${config_1.config.source_data_path}`;
TvShowLoaderService = TvShowLoaderService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [repositories_1.TvShowRepository])
], TvShowLoaderService);
exports.TvShowLoaderService = TvShowLoaderService;
//# sourceMappingURL=tv-show-loader.service.js.map