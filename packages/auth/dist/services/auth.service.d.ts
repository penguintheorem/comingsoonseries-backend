import { Observable } from 'rxjs';
import { GetTokenResponse } from '../models/get-token-response.interface';
import { User } from './../models/user.interface';
import { Auth0Service } from './auth0/auth0.service';
export declare class AuthService {
    private auth0Service;
    constructor(auth0Service: Auth0Service);
    signIn(user: User): Observable<GetTokenResponse>;
    signUp(user: User): Observable<string | undefined>;
}
