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
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const services_1 = require("@comingsoonseries/auth/services");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signIn(email, password) {
        return this.authService.signIn({ username: email, password });
    }
    signUp(email, password) {
        return this.authService
            .signUp({ username: email, password })
            .pipe(operators_1.mapTo(undefined));
    }
};
__decorate([
    common_1.Post('sign-in'),
    __param(0, common_1.Body('email')),
    __param(1, common_1.Body('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", rxjs_1.Observable)
], AuthController.prototype, "signIn", null);
__decorate([
    common_1.Post('sign-up'),
    __param(0, common_1.Body('email')),
    __param(1, common_1.Body('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", rxjs_1.Observable)
], AuthController.prototype, "signUp", null);
AuthController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [services_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map