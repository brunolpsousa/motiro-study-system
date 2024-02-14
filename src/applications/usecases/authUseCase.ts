import { Admin, ENTITIES, Instructor, Student } from '@entities'
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  ConflictError
} from '@errors'
import { jwt, User } from '@jwt'
import { AdminUseCase, InstructorUseCase, StudentUseCase } from '@usecases'
import { Request } from 'express'

type userUseCase = InstructorUseCase | StudentUseCase
// type userUseCase = AdminUseCase | InstructorUseCase | StudentUseCase

export class AuthUseCase {
  constructor(...args: userUseCase[]) {
    const usecases = []
    for (const arg of args) usecases.push(arg)
    if (!usecases.length)
      throw new Error('No usecases provided for authentication')
    this.usecases = usecases
  }

  private usecases: userUseCase[]

  private async isFirstAdmin(): Promise<boolean> {
    for (const usecase of this.usecases) {
      if (usecase.whoAmI() === 'admin') {
        const users = await usecase.countDocuments()
        if (users === 0) return true
      }
    }
    return false
  }

  private isAdminRole(token: string): boolean {
    if (!token) throw new UnauthorizedError('Not logged in')
    const { role } = jwt.decode(token) as User
    return role === 'admin'
  }

  private getUseCase(req: Request): string {
    let reqRole = req.body?.role
    if (!reqRole) throw new BadRequestError('Missing role')
    if (typeof reqRole !== 'string') throw new BadRequestError('Invalid role')
    reqRole = reqRole.toLowerCase()
    if (!Object.values(ENTITIES).includes(reqRole as ENTITIES))
      throw new BadRequestError('Invalid role')
    return reqRole
  }

  private async getUserByEmail(
    email: string
  ): Promise<
    { user: Admin | Instructor | Student; usecase: userUseCase } | undefined
  > {
    for (const usecase of this.usecases) {
      const users = await usecase?.listAll()
      if (users) {
        for (const user of users)
          if (user.email === email) return { user, usecase }
      }
    }
  }

  async register(req: Request) {
    const reqRole = this.getUseCase(req)
    const { name, email, password, specialty, schedule } = req.body
    const token = req.signedCookies?.token

    const getUseCase: () => userUseCase | undefined = () => {
      for (const usecase of this.usecases)
        if (usecase.whoAmI() === reqRole) return usecase
    }

    const usecase = getUseCase()
    if (!usecase) throw new BadRequestError('Invalid role')

    if (reqRole === 'admin') {
      if (!(await this.isFirstAdmin()) && !this.isAdminRole(token))
        throw new ForbiddenError('Access denied')
    }

    const emailAlreadyExists = await this.getUserByEmail(email)
    if (emailAlreadyExists)
      throw new ConflictError('Provided email is already registered')

    const user = await usecase.create({
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
    if (!email || !password) throw new BadRequestError('Missing credentials')

    const getUser = await this.getUserByEmail(email)
    if (!getUser) throw new BadRequestError('The email or password is invalid')
    const { user, usecase } = getUser

    const isPasswordCorrect = await usecase.comparePassword(user.id!, password)
    if (!isPasswordCorrect)
      throw new BadRequestError('The email or password is invalid')

    const userToken = jwt.createUserToken(user)
    return userToken
  }
}
