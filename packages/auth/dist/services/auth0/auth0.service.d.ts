import { GetTokenResponse } from './../../models/get-token-response.interface';
import { User } from './../../models/user.interface';
import { SignUpResponse } from './../../models/sign-up-response.interface';
import { HttpService } from '@nestjs/common';
import { Auth0Options } from './../../models/auth0-options.interface';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { MailerService } from '@nest-modules/mailer';
export declare class Auth0Service {
    private readonly httpService;
    private readonly mailerService;
    private readonly DOMAIN;
    private readonly AUDIENCE;
    private readonly CLIENT_ID;
    private readonly CLIENT_SECRET;
    private readonly CONNECTION;
    private readonly MANAGEMENT_API_TOKEN;
    private readonly GET_ACCESS_TOKEN_ENDPOINT;
    private readonly SIGNUP_ENDPOINT;
    private readonly GET_TICKET_ENDPOINT;
    private readonly POST_VERIFICATION_REDIRECT_URL;
    private readonly DEFAULT_OPTIONS;
    private readonly USER_ID_PREFIX;
    constructor(httpService: HttpService, mailerService: MailerService);
    getToken(user: User): Observable<AxiosResponse<GetTokenResponse>>;
    signUp(user: User): Observable<AxiosResponse<SignUpResponse>>;
    askForEmailVerification(userId: string, userEmail: string): Observable<string>;
    get defaultOptions(): Auth0Options;
}
