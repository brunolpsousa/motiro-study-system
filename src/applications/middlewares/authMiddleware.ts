import { Request, Response, NextFunction } from 'express'
import { jwt } from '@jwt'
import { Types } from 'mongoose'
import { User } from 'user/dto'
import { ForbiddenException, UnauthorizedException } from '@nestjs/common'

class AuthMiddleware {
  public authUser = (req: Request, _: Response, next: NextFunction) => {
    const token = req.signedCookies?.token
    if (!token) throw new UnauthorizedException('Not logged in')

    try {
      const { name, role, id } = jwt.decode(token) as User
      req.body.user = { name, role, id }
      next()
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication')
    }
  }

  public checkRole = (...roles: string[]) => {
    return (req: Request, _: Response, next: NextFunction) => {
      if (!roles.includes(req.body.user?.role))
        throw new ForbiddenException('Access denied')
      next()
    }
  }

  public checkUserPermissions = (
    requestUser: { user: { role: string; id: string } },
    resourceId: Types.ObjectId | string
  ) => {
    if (requestUser.user?.role === 'admin') return
    if (requestUser.user?.id === resourceId.toString()) return
    throw new ForbiddenException('Access denied')
  }
}

export const authMiddleware = new AuthMiddleware()
