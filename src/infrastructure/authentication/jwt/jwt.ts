import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { User } from 'user/dto'

const { JWT_SECRET, JWT_LIFETIME } = process.env

class JsonWebToken {
  encode(payload: object) {
    return jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: JWT_LIFETIME
    })
  }

  decode(token: string) {
    return jwt.verify(token, JWT_SECRET as string)
  }

  createUserToken(user: User): User {
    return { id: user.id, name: user.name, role: user.role } as User
  }

  attachCookies({ res, user }: { res: Response; user: User }) {
    const token = this.encode(user)

    const oneDay = 1000 * 60 * 60 * 24

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      signed: true
    })
  }
}

const jwtInstance = new JsonWebToken()
export { jwtInstance as jwt }
