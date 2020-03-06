import { Module, HttpModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { Auth0Service } from './services/auth0/auth0.service';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { JwtStrategy } from './services/jwt-strategy';

@Module({
  imports: [
    HttpModule,
    MailerModule.forRoot({
      transport: `smtps://attiliourb@gmail.com:yjftxuwbzvchjagk@smtp.gmail.com`,
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy, Auth0Service],
  exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule {}
