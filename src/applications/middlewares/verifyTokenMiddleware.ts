import { ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env

export const verifyToken = (req: Request, _: Response, next: NextFunction) => {
  const token = req.signedCookies?.token

  jwt.verify(token, JWT_SECRET as string, (err: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ForbiddenException('Session expired')
      } else {
        throw new UnauthorizedException('Invalid authentication')
      }
    } else {
      next()
    }
  })
}
