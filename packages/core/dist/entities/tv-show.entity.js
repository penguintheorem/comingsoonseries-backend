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
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
let TvShow = class TvShow {
};
__decorate([
    typeorm_1.ObjectIdColumn({ name: '_id' }),
    __metadata("design:type", typeorm_1.ObjectID)
], TvShow.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TvShow.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TvShow.prototype, "imdb_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TvShow.prototype, "release_year", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Array)
], TvShow.prototype, "genres", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TvShow.prototype, "minutes", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], TvShow.prototype, "isAdult", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TvShow.prototype, "imdb_average_rank", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TvShow.prototype, "imdb_num_votes", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TvShow.prototype, "country", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], TvShow.prototype, "next_release_date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TvShow.prototype, "trailer", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TvShow.prototype, "plot", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TvShow.prototype, "poster", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TvShow.prototype, "cover", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Array)
], TvShow.prototype, "networks", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Array)
], TvShow.prototype, "directors", void 0);
__decorate([
    typeorm_1.Column(type => models_1.Product),
    __metadata("design:type", Array)
], TvShow.prototype, "products", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TvShow.prototype, "countLists", void 0);
TvShow = __decorate([
    typeorm_1.Entity()
], TvShow);
exports.TvShow = TvShow;
//# sourceMappingURL=tv-show.entity.js.map