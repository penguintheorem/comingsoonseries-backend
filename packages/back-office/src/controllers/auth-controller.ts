import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { GetTokenResponse } from '@comingsoonseries/auth/models/get-token-response.interface';
import { AuthService } from '@comingsoonseries/auth/services';

@Controller('bo/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Observable<GetTokenResponse> {
    return this.authService.signIn({ username: email, password });
  }

  @Post('sign-up')
  signUp(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Observable<void> {
    return this.authService
      .signUp({ username: email, password })
      .pipe(mapTo(undefined));
  }
}
