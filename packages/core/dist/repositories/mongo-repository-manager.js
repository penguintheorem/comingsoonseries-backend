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
const repository_manager_abstract_1 = require("./repository-manager.abstract");
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
let MongoRepositoryManager = class MongoRepositoryManager extends repository_manager_abstract_1.RepositoryManager {
    constructor() {
        super();
    }
    getEntityManager() {
        return repository_manager_abstract_1.RepositoryManager.getConnection().pipe(operators_1.pluck('mongoManager'));
    }
    getRepository(entity) {
        return repository_manager_abstract_1.RepositoryManager.getConnection().pipe(operators_1.map(connection => connection.getMongoRepository(entity)), operators_1.tap(repo => console.log('repo: ', repo)));
    }
};
MongoRepositoryManager = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], MongoRepositoryManager);
exports.MongoRepositoryManager = MongoRepositoryManager;
//# sourceMappingURL=mongo-repository-manager.js.map