import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

/**
 * {
  "iss": "https://dev-76juwrx1.eu.auth0.com/",
  "sub": "auth0|5e4f8b1d9834c80ce3f17839",
  "aud": "https://comingsoonseries-api.com/tv-shows",
  "iat": 1582752983,
  "exp": 1582839383,
  "azp": "ZPftMVSaSWFF8xQkfXGCyS4R5OrFdhmR",
  "gty": "password"
}
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  static readonly STRATEGY_OPTIONS = {
    secretOrKeyProvider: passportJwtSecret({
      cache: true, // @REVIEW
      rateLimit: true, // @REVIEW
      jwksRequestsPerMinute: 5, // @REVIEW
      jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`,
    }),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    audience: `${process.env.AUTH0_AUDIENCE}`,
    issuer: `${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'], // @REVIEW
  };

  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true, // @REVIEW
        rateLimit: true, // @REVIEW
        jwksRequestsPerMinute: 5, // @REVIEW
        jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `${process.env.AUTH0_AUDIENCE}`,
      issuer: `${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256'], // @REVIEW
    });
    // you need to pass the configuration options for your strategy here
  }

  /**
   * The verify callback for PassportJS.
   *
   * It should find the user associated with the given set of credentials.
   *
   * In this case is so simple because auth0, in the middle, pass inside the
   * `payload` the user's data.
   *
   * @param payload
   */
  validate(payload: any) {
    return payload;
  }
}
