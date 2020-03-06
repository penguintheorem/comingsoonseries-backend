"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./services/auth.service");
const auth0_service_1 = require("./services/auth0/auth0.service");
const mailer_1 = require("@nest-modules/mailer");
const jwt_strategy_1 = require("./services/jwt-strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    common_1.Module({
        imports: [
            common_1.HttpModule,
            mailer_1.MailerModule.forRoot({
                transport: `smtps://attiliourb@gmail.com:yjftxuwbzvchjagk@smtp.gmail.com`,
                defaults: {
                    from: '"nest-modules" <modules@nestjs.com>',
                },
                template: {
                    dir: __dirname + '/templates',
                    adapter: new mailer_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            passport_1.PassportModule,
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, auth0_service_1.Auth0Service],
        exports: [passport_1.PassportModule, jwt_strategy_1.JwtStrategy, auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map