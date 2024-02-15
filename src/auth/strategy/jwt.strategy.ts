import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { MongoService } from '../../mongo/mongo.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private mongo: MongoService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      secretOrKey: config.get('JWT_SECRET')
    })
  }

  private static extractJWT(req: any): string | null {
    if (
      req.signedCookies &&
      'token' in req.signedCookies &&
      req.signedCookies.token.length > 0
    ) {
      return req.signedCookies.token
    }
    return null
  }

  async validate(payload: { id: string; email: string }) {
    const user = await this.mongo.findById(payload.id)
    delete user?.password
    return user
  }
}
