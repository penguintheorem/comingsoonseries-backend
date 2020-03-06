import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller('u')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  getUserData(
    @Param() urlSegmentParams: { userId: string },
  ): Observable<{ id: string; name: string; surname: string }> {
    return of({
      id: urlSegmentParams.userId,
      name: 'Same shit',
      surname: 'Same shit twice',
    });
  }
}
