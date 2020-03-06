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
const utils_1 = require("@comingsoonseries/common/utils");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const auth0_service_1 = require("./auth0/auth0.service");
let AuthService = class AuthService {
    constructor(auth0Service) {
        this.auth0Service = auth0Service;
    }
    signIn(user) {
        console.log('sign-in user: ', user);
        return this.auth0Service.getToken(user).pipe(operators_1.catchError(error => {
            return rxjs_1.throwError(utils_1.ErrorUtils.formatAuth0Exception(error));
        }), operators_1.tap(response => console.log(`the sign-in is fucking successful`)), operators_1.map(response => response.data));
    }
    signUp(user) {
        console.log('sign-up user: ', user);
        return this.auth0Service.signUp(user).pipe(operators_1.map(response => response.data), operators_1.switchMap((signUpResponse) => signUpResponse.email_verified === false
            ? this.auth0Service.askForEmailVerification(signUpResponse._id, signUpResponse.email)
            : rxjs_1.of(undefined)), operators_1.tap(response => console.log(`the sign-up is fucking successful`)), operators_1.catchError(error => {
            console.log('error: ', error);
            return rxjs_1.throwError(utils_1.ErrorUtils.formatAuth0Exception(error));
        }));
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth0_service_1.Auth0Service])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map