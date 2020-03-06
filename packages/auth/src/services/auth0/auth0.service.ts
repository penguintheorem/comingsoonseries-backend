import { GetTokenResponse } from './../../models/get-token-response.interface';
import { User } from './../../models/user.interface';
import { SignUpResponse } from './../../models/sign-up-response.interface';
import { Injectable, HttpService } from '@nestjs/common';
import { Auth0Options } from './../../models/auth0-options.interface';
import { Observable, throwError, from } from 'rxjs';
import { AxiosResponse } from 'axios';
import { catchError, pluck, switchMap } from 'rxjs/operators';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class Auth0Service {
  // @REFACTOR
  private readonly DOMAIN = process.env.AUTH0_DOMAIN;
  private readonly AUDIENCE = process.env.AUTH0_AUDIENCE;
  private readonly CLIENT_ID = process.env.CLIENT_ID;
  private readonly CLIENT_SECRET = process.env.CLIENT_SECRET;
  private readonly CONNECTION = process.env.CONNECTION;
  private readonly MANAGEMENT_API_TOKEN =
    process.env.AUTH0_MANAGEMENT_API_TOKEN;

  private readonly GET_ACCESS_TOKEN_ENDPOINT = `oauth/token`;
  private readonly SIGNUP_ENDPOINT = `dbconnections/signup`;
  private readonly GET_TICKET_ENDPOINT = `api/v2/tickets/email-verification`;
  private readonly POST_VERIFICATION_REDIRECT_URL = 'http://localhost:4200';

  private readonly DEFAULT_OPTIONS: Auth0Options = {
    grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
    audience: this.AUDIENCE,
    scope: 'SCOPE',
    realm: this.CONNECTION,
    // realm: 'email',
    client_id: this.CLIENT_ID,
    client_secret: this.CLIENT_SECRET,
  };
  private readonly USER_ID_PREFIX = 'auth0|';

  constructor(
    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,
  ) {
    console.log(`DOMAIN:${this.DOMAIN}`);
    console.log(`AUDIENCE:${this.AUDIENCE}`);
    console.log(`CLIENT_ID:${this.CLIENT_ID}`);
    console.log(`CLIENT_SECRET:${this.CLIENT_SECRET}`);
    console.log(`CONNECTION:${this.CONNECTION}`);
  }

  getToken(user: User): Observable<AxiosResponse<GetTokenResponse>> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const formData = { ...this.defaultOptions, ...user };

    const encodedFormData = Object.keys(formData).reduce((prev, curr) => {
      return `${prev}&${curr}=${encodeURIComponent(formData[curr])}`;
    }, ``);
    return this.httpService.post(
      `${this.DOMAIN}/${this.GET_ACCESS_TOKEN_ENDPOINT}`,
      `${encodedFormData}`,
      { headers },
    );
  }

  signUp(user: User): Observable<AxiosResponse<SignUpResponse>> {
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
      .pipe(
        catchError(err => {
          return throwError(err);
        }),
      );
  }

  askForEmailVerification(
    userId: string,
    userEmail: string,
  ): Observable<string> {
    console.log(`ask for email verification to: ${userId}`);
    return this.httpService
      .post<string>(
        `${this.DOMAIN}/${this.GET_TICKET_ENDPOINT}`,
        {
          user_id: `${this.USER_ID_PREFIX}${userId}`,
          result_url: this.POST_VERIFICATION_REDIRECT_URL,
        },
        {
          headers: {
            Authorization: `Bearer ${this.MANAGEMENT_API_TOKEN}`,
          },
        },
      )
      .pipe(
        pluck('data'),
        switchMap((obj: any) => {
          return from(
            this.mailerService.sendMail({
              to: userEmail,
              from: 'attiliourb@gmail.com',
              subject: 'Test email verification',
              html: `<b>Hey man, here the verification link: ${obj.ticket}</b>`,
            }),
          );
        }),
      );
  }

  get defaultOptions(): Auth0Options {
    return this.DEFAULT_OPTIONS;
  }
}
