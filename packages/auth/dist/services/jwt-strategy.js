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
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwks_rsa_1 = require("jwks-rsa");
let JwtStrategy = class JwtStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy) {
    constructor() {
        console.log('process.env.AUTH0_AUDIENCE: ', process.env.AUTH0_AUDIENCE);
        console.log('process.env.AUTH0_DOMAIN: ', process.env.AUTH0_DOMAIN);
        super({
            secretOrKeyProvider: jwks_rsa_1.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
            }),
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: `${process.env.AUTH0_AUDIENCE}`,
            issuer: `${process.env.AUTH0_DOMAIN}/`,
            algorithms: ['RS256'],
        });
    }
    validate(payload) {
        console.log('fucking validation process: ', payload);
        return payload;
    }
};
JwtStrategy.STRATEGY_OPTIONS = {
    secretOrKeyProvider: jwks_rsa_1.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`,
    }),
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    audience: `${process.env.AUTH0_AUDIENCE}`,
    issuer: `${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
};
JwtStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt-strategy.js.map