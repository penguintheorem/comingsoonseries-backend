import { Observable } from 'rxjs';
import { GetTokenResponse } from '@comingsoonseries/auth/models/get-token-response.interface';
import { AuthService } from '@comingsoonseries/auth/services';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(email: string, password: string): Observable<GetTokenResponse>;
    signUp(email: string, password: string): Observable<void>;
}
