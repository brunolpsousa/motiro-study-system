import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { jwt, User } from 'infrastructure/authentication/jwt'

class AuthMiddleware {
  authenticateUser(req: Request, _: Response, next: NextFunction) {
    const token = req.signedCookies.token

    if (!token) {
      throw new Error('Authentication Invalid')
    }

    try {
      const { userId, name, role } = jwt.decode(token) as User
      req.body.user = { userId, name, role }
      next()
    } catch (error) {
      throw new Error('Authentication Invalid')
    }
  }

  authorizePermissions(...roles: string[]) {
    return (req: Request, _: Response, next: NextFunction) => {
      if (!roles.includes(req.body.user.role)) {
        throw new Error('Unauthorized to access this route')
      }
      next()
    }
  }

  chechPermissions(
    requestUser: { role: string; userId: string },
    resourceUserId: Types.ObjectId
  ) {
    if (requestUser.role === 'admin') return
    if (requestUser.userId === resourceUserId.toString()) return
    throw new Error('Not authorized to access this route')
  }
}

export const authMiddleware = new AuthMiddleware()
