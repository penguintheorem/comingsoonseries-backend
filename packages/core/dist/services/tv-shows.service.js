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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const repositories_1 = require("../repositories");
const ordering_mode_1 = require("../models/ordering-mode");
let TvShowsService = class TvShowsService {
    constructor(tvShowRepository) {
        this.tvShowRepository = tvShowRepository;
    }
    find(tvShowId) {
        return this.tvShowRepository.find(tvShowId);
    }
    getTvShowPosters(paginationParams, filters, sortingParams) {
        console.log({ paginationParams, filters, sortingParams });
        return this.tvShowRepository.getTvShowPosters(paginationParams, filters, sortingParams);
    }
    getSponsoredTvShows(paginationParams) {
        return rxjs_1.forkJoin({
            trending: this.tvShowRepository.getTvShowPosters(paginationParams, {}, {
                sort: ordering_mode_1.OrderingMode.BY_POPULARITY,
            }),
            latest: this.tvShowRepository.getTvShowPosters(paginationParams, {}, {
                sort: ordering_mode_1.OrderingMode.BY_DATE,
            }),
            mustToSee: this.tvShowRepository.getTvShowPosters(paginationParams, {}, {
                sort: ordering_mode_1.OrderingMode.BY_RANK,
            }),
        });
    }
    getSuggestions(searchTerm) {
        return this.tvShowRepository.getSuggestions(searchTerm);
    }
    getProducts(tvShowId) {
        return this.tvShowRepository.getProducts(tvShowId);
    }
    create(tvShowDto) {
        return this.tvShowRepository.add(this.tvShowRepository.getEntityFromDTO(tvShowDto));
    }
    update(tvShowId, tvShow) {
        return this.tvShowRepository.update(tvShowId, tvShow);
    }
};
TvShowsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [repositories_1.TvShowRepository])
], TvShowsService);
exports.TvShowsService = TvShowsService;
//# sourceMappingURL=tv-shows.service.js.map