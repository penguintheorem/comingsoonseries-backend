"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_interceptor_1 = require("./interceptors/errors.interceptor");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const tv_shows_controller_1 = require("./controllers/tv-shows.controller");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const auth_module_1 = require("@comingsoonseries/auth/auth.module");
const core_module_1 = require("@comingsoonseries/core/core.module");
const auth_controller_1 = require("./controllers/auth.controller");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [auth_module_1.AuthModule, core_module_1.CoreModule],
        controllers: [tv_shows_controller_1.TvShowsController, auth_controller_1.AuthController],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: errors_interceptor_1.ErrorsInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map