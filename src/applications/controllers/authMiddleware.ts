import { Request, Response, NextFunction } from 'express'
import { jwt, User } from 'infrastructure/authentication/jwt'
import { Types } from 'mongoose'

class AuthMiddleware {
  authUser(req: Request, _: Response, next: NextFunction) {
    const token = req.signedCookies.token

    if (!token) {
      throw new Error('Invalid authentication')
    }

    try {
      const { userId, name, role } = jwt.decode(token) as User
      req.body.user = { userId, name, role }
      next()
    } catch (error) {
      throw new Error('Invalid authentication')
    }
  }

  checkRole(...roles: string[]) {
    return (req: Request, _: Response, next: NextFunction) => {
      if (!roles.includes(req.body.user.role)) {
        throw new Error('Unauthorized')
      }
      next()
    }
  }

  chechUserPermissions(
    requestUser: { role: string; userId: string },
    resourceUserId: Types.ObjectId
  ) {
    if (requestUser.role === 'admin') return
    if (requestUser.userId === resourceUserId.toString()) return
    throw new Error('Unauthorized')
  }
}

export const authMiddleware = new AuthMiddleware()
