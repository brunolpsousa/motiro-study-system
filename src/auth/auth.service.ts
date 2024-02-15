import { Injectable } from '@nestjs/common'
import { jwt } from 'auth/strategy'
import { UserService } from 'user'
import { Request } from 'express'
import { User, ENTITIES } from 'user/dto'
import { BadRequestException, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  private async isFirstAdmin(): Promise<boolean> {
    if (this.userService.whoAmI() === 'admin') {
      const users = await this.userService.countDocuments()
      if (users === 0) return true
    }
    return false
  }

  private isAdminRole(token: string): boolean {
    if (!token) throw new UnauthorizedException('Not logged in')
    const { role } = jwt.decode(token) as User
    return role === 'admin'
  }

  private getUseCase(req: Request): string {
    let reqRole = req.body?.role
    if (!reqRole) throw new BadRequestException('Missing role')
    if (typeof reqRole !== 'string')
      throw new BadRequestException('Invalid role')
    reqRole = reqRole.toLowerCase()
    if (!Object.values(ENTITIES).includes(reqRole as ENTITIES))
      throw new BadRequestException('Invalid role')
    return reqRole
  }

  private async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.userService.listAll()
    if (users) for (const user of users) if (user.email === email) return user
  }

  async register(req: Request) {
    const reqRole = this.getUseCase(req)
    const { name, email, password, specialty, schedule } = req.body
    const token = req.signedCookies?.token

    if (reqRole === 'admin') {
      if (!(await this.isFirstAdmin()) && !this.isAdminRole(token))
        throw new BadRequestException('Access denied')
    }

    const emailAlreadyExists = await this.getUserByEmail(email)
    if (emailAlreadyExists)
      throw new BadRequestException('Provided email is already registered')

    const user = await this.userService.create({
      name,
      email,
      password,
      specialty,
      schedule
    })

    const userToken = jwt.createUserToken(user)
    return userToken
  }

  async login(req: Request) {
    const { email, password } = req.body
    if (!email || !password)
      throw new BadRequestException('Missing credentials')

    const user = await this.getUserByEmail(email)
    if (!user) throw new BadRequestException('The email or password is invalid')

    const isPasswordCorrect = await this.userService.comparePassword(
      user.id!,
      password
    )
    if (!isPasswordCorrect)
      throw new BadRequestException('The email or password is invalid')

    const userToken = jwt.createUserToken(user)
    return userToken
  }
}
