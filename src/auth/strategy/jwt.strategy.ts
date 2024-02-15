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
      jwtFromRequest: ExtractJwt.fromBodyField('user'),
      secretOrKey: config.get('JWT_SECRET')
    })
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.mongo.findById(payload.sub)
    delete user?.password
    return user
  }
}
