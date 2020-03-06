"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_module_1 = require("@comingsoonseries/core/core.module");
const common_1 = require("@nestjs/common");
const tv_show_loader_service_1 = require("./service/tv-show-loader.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [core_module_1.CoreModule],
        providers: [tv_show_loader_service_1.TvShowLoaderService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map