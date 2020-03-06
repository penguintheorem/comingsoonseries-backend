import { ErrorUtils } from '@comingsoonseries/common/utils';
import { Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { GetTokenResponse } from '../models/get-token-response.interface';
import { SignUpResponse } from '../models/sign-up-response.interface';
import { User } from './../models/user.interface';
import { Auth0Service } from './auth0/auth0.service';

@Injectable()
export class AuthService {
  constructor(private auth0Service: Auth0Service) {}

  signIn(user: User): Observable<GetTokenResponse> {
    console.log('sign-in user: ', user);
    return this.auth0Service.getToken(user).pipe(
      catchError(error => {
        return throwError(ErrorUtils.formatAuth0Exception(error));
      }),
      tap(response => console.log(`the sign-in is fucking successful`)),
      map(response => response.data),
    );
  }

  signUp(user: User): Observable<string | undefined> {
    console.log('sign-up user: ', user);
    return this.auth0Service.signUp(user).pipe(
      map(response => response.data),
      switchMap((signUpResponse: SignUpResponse) =>
        signUpResponse.email_verified === false
          ? this.auth0Service.askForEmailVerification(
              signUpResponse._id,
              signUpResponse.email,
            )
          : of(undefined),
      ),
      tap(response => console.log(`the sign-up is fucking successful`)),
      catchError(error => {
        console.log('error: ', error);
        return throwError(ErrorUtils.formatAuth0Exception(error));
      }),
    );
  }
}
