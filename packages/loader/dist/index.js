"use strict";
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
const repositories_1 = require("@comingsoonseries/core/repositories");
const core_1 = require("@nestjs/core");
require("reflect-metadata");
const dotenv = require("dotenv");
const tv_show_loader_service_1 = require("./service/tv-show-loader.service");
const app_module_1 = require("./app.module");
dotenv.config();
(function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const loader = app.get(tv_show_loader_service_1.TvShowLoaderService);
        repositories_1.RepositoryManager.getConnection().subscribe(conn => {
            console.log(`connection ${conn.name} established`);
            loader.load();
        }, err => {
            throw new Error(`there was an error trying to connect to the DB: ${err}`);
        });
    });
})();
//# sourceMappingURL=index.js.map