import { Controller, Get, Post, Req, Res } from '@nestjs/common'
import { jwt } from './strategy'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {
    const tokenUser = await this.authService.register(req)
    const token = req.signedCookies?.token
    if (!token) jwt.attachCookies({ res, user: tokenUser })
    return res.send(tokenUser)
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const userToken = await this.authService.login(req)
    jwt.attachCookies({ res, user: userToken })
    return res.send(userToken)
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res
      .cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date()
      })
      .send()
  }
}
