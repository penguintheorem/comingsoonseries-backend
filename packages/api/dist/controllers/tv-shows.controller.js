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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("@comingsoonseries/core/services");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const entities_1 = require("@comingsoonseries/core/entities");
let TvShowsController = class TvShowsController {
    constructor(tvShowsService) {
        this.tvShowsService = tvShowsService;
    }
    getTvShowPosters(query) {
        const { page, size } = query;
        const sort = query.sort && +query.sort;
        const { title, genres } = query;
        return this.tvShowsService.getTvShowPosters({ page: +page, size: +size }, { title, genres: genres ? genres.split(',') : undefined }, { sort });
    }
    getSponsoredTvShows(query) {
        const { page, size } = query;
        return this.tvShowsService.getSponsoredTvShows({
            page: +page,
            size: +size,
        });
    }
    getTvShowSuggestions(query) {
        const { q } = query;
        return this.tvShowsService.getSuggestions(q);
    }
    getTvShow(urlSegmentParams) {
        return this.tvShowsService.find(urlSegmentParams.tvShowId);
    }
    getProducts(urlSegmentParams) {
        return this.tvShowsService.getProducts(urlSegmentParams.tvShowId);
    }
    create(tvShowDto) {
        return this.tvShowsService.create(tvShowDto);
    }
    update(urlSegmentParams, tvShow) {
        return this.tvShowsService.update(urlSegmentParams.tvShowId, tvShow);
    }
};
__decorate([
    common_1.Get('posters'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], TvShowsController.prototype, "getTvShowPosters", null);
__decorate([
    common_1.Get('sponsored'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], TvShowsController.prototype, "getSponsoredTvShows", null);
__decorate([
    common_1.Get('suggestions'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], TvShowsController.prototype, "getTvShowSuggestions", null);
__decorate([
    common_1.Get(':tvShowId'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], TvShowsController.prototype, "getTvShow", null);
__decorate([
    common_1.Get(':tvShowId/products'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], TvShowsController.prototype, "getProducts", null);
__decorate([
    common_1.Post(''),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], TvShowsController.prototype, "create", null);
__decorate([
    common_1.Put(':tvShowId'),
    __param(0, common_1.Param()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, entities_1.TvShow]),
    __metadata("design:returntype", rxjs_1.Observable)
], TvShowsController.prototype, "update", null);
TvShowsController = __decorate([
    common_1.Controller('tv-shows'),
    __metadata("design:paramtypes", [services_1.TvShowsService])
], TvShowsController);
exports.TvShowsController = TvShowsController;
//# sourceMappingURL=tv-shows.controller.js.map