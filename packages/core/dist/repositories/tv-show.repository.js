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
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize = require("mongo-sanitize");
const mongodb_1 = require("mongodb");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const typeorm_1 = require("typeorm");
const tv_show_entity_1 = require("../entities/tv-show.entity");
const models_1 = require("../models");
const mongo_repository_manager_1 = require("./mongo-repository-manager");
const common_1 = require("@nestjs/common");
let TvShowRepository = class TvShowRepository {
    constructor(_manager) {
        this._manager = _manager;
    }
    add(tvShow) {
        return this._manager.getRepository(tv_show_entity_1.TvShow).pipe(operators_1.switchMap(repo => rxjs_1.from(repo.save(tvShow))), operators_1.map(() => tvShow));
    }
    find(tvShowId) {
        return this._manager.getRepository(tv_show_entity_1.TvShow).pipe(operators_1.switchMap(repo => rxjs_1.from(repo.find({ where: { _id: new mongodb_1.ObjectId(tvShowId) } }))), operators_1.map(tvShows => tvShows[0]));
    }
    getSuggestions(searchTerm) {
        return this._manager.getRepository(tv_show_entity_1.TvShow).pipe(operators_1.switchMap(repo => rxjs_1.from(repo.find({
            where: { title: new RegExp(sanitize(searchTerm), 'i') },
            order: { imdb_average_rank: 'DESC' },
            take: 20,
        }))), operators_1.map((tvShows) => this.toTvShowSuggestions(tvShows)));
    }
    getTvShowPosters(paginationParams, filters, sortingParams) {
        const { page, size } = paginationParams;
        const { sort } = sortingParams;
        const { title, genres, isAdult, ended } = filters;
        const ordering = 'DESC';
        return this._manager.getRepository(tv_show_entity_1.TvShow).pipe(operators_1.tap(repo => console.log('connection established')), operators_1.switchMap(repo => rxjs_1.from(repo.find(Object.assign(Object.assign(Object.assign({}, (paginationParams && { skip: page * size, take: size })), { select: ['id', 'title', 'networks', 'poster'], where: Object.assign(Object.assign({}, (title && { title: new RegExp(`.*${title}.*`, 'i') })), (genres && { genres: { $in: genres } })) }), (sortingParams && {
            order: Object.assign(Object.assign(Object.assign({}, (models_1.OrderingMode.BY_RANK === sort && {
                imdb_average_rank: ordering,
            })), (models_1.OrderingMode.BY_DATE === sort && {
                next_release_date: ordering,
            })), (models_1.OrderingMode.BY_POPULARITY === sort && {
                countLists: ordering,
            })),
        }))))), operators_1.map((tvShows) => this.toTvShowGridItems(tvShows)));
    }
    getProducts(tvShowId) {
        return this.find(tvShowId).pipe(operators_1.map(tvShow => (tvShow ? tvShow.products : undefined)));
    }
    update(tvShowId, newTvShow) {
        return this._manager.getRepository(tv_show_entity_1.TvShow).pipe(operators_1.switchMap(tvShowRepository => tvShowRepository.update(tvShowId, newTvShow)), operators_1.map((updateResult) => updateResult[0]));
    }
    toTvShowSuggestions(tvShows) {
        return tvShows.map(tvShow => {
            return {
                id: tvShow.id.toString(),
                title: tvShow.title,
                plot: tvShow.plot,
                release_year: tvShow.release_year,
                imdb_average_rank: tvShow.imdb_average_rank,
            };
        });
    }
    toTvShowGridItems(tvShows) {
        return tvShows.map(tvShow => {
            return {
                id: tvShow.id.toString(),
                title: tvShow.title,
                networks: tvShow.networks,
                poster: tvShow.poster,
            };
        });
    }
    getEntityFromDTO(tvShowDTO) {
        const tvShow = new tv_show_entity_1.TvShow();
        tvShow.imdb_id = tvShowDTO.tconst;
        tvShow.title = tvShowDTO.primaryTitle;
        tvShow.release_year = tvShowDTO.startYear;
        tvShow.genres = tvShowDTO.genres;
        tvShow.isAdult = tvShowDTO.isAdult;
        tvShow.minutes = tvShowDTO.runtimeMinutes;
        tvShow.imdb_average_rank = tvShowDTO.imdb_average_rank;
        tvShow.imdb_num_votes = tvShowDTO.imdb_num_votes;
        tvShow.country = tvShowDTO.country;
        tvShow.next_release_date = null;
        tvShow.trailer = null;
        tvShow.plot = null;
        tvShow.poster = null;
        tvShow.cover = null;
        tvShow.directors = [];
        tvShow.networks = [];
        tvShow.products = [];
        tvShow.countLists = 0;
        return tvShow;
    }
    addFromDto(tvShowDTO) {
        this.add(this.getEntityFromDTO(tvShowDTO));
    }
    load(tvShowDTOs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const c = yield typeorm_1.getConnection();
                const repo = c.getRepository(tv_show_entity_1.TvShow);
                yield repo.save(this.getEntitiesFromDTOs(tvShowDTOs));
            }
            catch (e) {
                console.error(`err: ${e}`);
            }
        });
    }
    getEntitiesFromDTOs(tvShowDTOs) {
        return tvShowDTOs.map(this.getEntityFromDTO);
    }
};
TvShowRepository = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [mongo_repository_manager_1.MongoRepositoryManager])
], TvShowRepository);
exports.TvShowRepository = TvShowRepository;
//# sourceMappingURL=tv-show.repository.js.map