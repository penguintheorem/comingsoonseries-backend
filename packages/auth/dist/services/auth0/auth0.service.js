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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const mailer_1 = require("@nest-modules/mailer");
let Auth0Service = class Auth0Service {
    constructor(httpService, mailerService) {
        this.httpService = httpService;
        this.mailerService = mailerService;
        this.DOMAIN = process.env.AUTH0_DOMAIN;
        this.AUDIENCE = process.env.AUTH0_AUDIENCE;
        this.CLIENT_ID = process.env.CLIENT_ID;
        this.CLIENT_SECRET = process.env.CLIENT_SECRET;
        this.CONNECTION = process.env.CONNECTION;
        this.MANAGEMENT_API_TOKEN = process.env.AUTH0_MANAGEMENT_API_TOKEN;
        this.GET_ACCESS_TOKEN_ENDPOINT = `oauth/token`;
        this.SIGNUP_ENDPOINT = `dbconnections/signup`;
        this.GET_TICKET_ENDPOINT = `api/v2/tickets/email-verification`;
        this.POST_VERIFICATION_REDIRECT_URL = 'http://localhost:4200';
        this.DEFAULT_OPTIONS = {
            grant_type: 'password',
            audience: this.AUDIENCE,
            scope: 'SCOPE',
            realm: 'email',
            client_id: this.CLIENT_ID,
            client_secret: this.CLIENT_SECRET,
        };
        this.USER_ID_PREFIX = 'auth0|';
    }
    getToken(user) {
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        const formData = Object.assign(Object.assign({}, this.defaultOptions), user);
        const encodedFormData = Object.keys(formData).reduce((prev, curr) => {
            return `${prev}&${curr}=${encodeURIComponent(formData[curr])}`;
        }, ``);
        return this.httpService.post(`${this.DOMAIN}/${this.GET_ACCESS_TOKEN_ENDPOINT}`, `${encodedFormData}`, { headers });
    }
    signUp(user) {
        const headers = { 'Content-Type': 'application/json' };
        const data = {
            client_id: this.CLIENT_ID,
            connection: this.CONNECTION,
            email: user.username,
            username: user.username,
            password: user.password,
        };
        return this.httpService
            .post(`${this.DOMAIN}/${this.SIGNUP_ENDPOINT}`, data, { headers })
            .pipe(operators_1.catchError(err => {
            return rxjs_1.throwError(err);
        }));
    }
    askForEmailVerification(userId, userEmail) {
        console.log(`ask for email verification to: ${userId}`);
        return this.httpService
            .post(`${this.DOMAIN}/${this.GET_TICKET_ENDPOINT}`, {
            user_id: `${this.USER_ID_PREFIX}${userId}`,
            result_url: this.POST_VERIFICATION_REDIRECT_URL,
        }, {
            headers: {
                Authorization: `Bearer ${this.MANAGEMENT_API_TOKEN}`,
            },
        })
            .pipe(operators_1.pluck('data'), operators_1.switchMap((obj) => {
            return rxjs_1.from(this.mailerService.sendMail({
                to: userEmail,
                from: 'attiliourb@gmail.com',
                subject: 'Test email verification',
                html: `<b>Hey man, here the verification link: ${obj.ticket}</b>`,
            }));
        }));
    }
    get defaultOptions() {
        return this.DEFAULT_OPTIONS;
    }
};
Auth0Service = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService,
        mailer_1.MailerService])
], Auth0Service);
exports.Auth0Service = Auth0Service;
//# sourceMappingURL=auth0.service.js.map