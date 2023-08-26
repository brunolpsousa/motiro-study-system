import { Request, Response } from 'express'
import AuthController from './authController'
import { studentModel } from 'studentModel'
import { jwt, User } from '../../infrastructure/authentication/jwt'

class StudentAuthController extends AuthController {
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body

    const emailAlreadyExists = await studentModel.findOne({ email })
    if (emailAlreadyExists) {
      throw new Error('Email already exists')
    }

    const user = await studentModel.create({ name, email, password })
    const tokenUser = jwt.createTokenUser(user as unknown as User)
    jwt.attachCookies({ res, user: tokenUser })

    res.status(201).json(tokenUser)
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body
    if (!email || !password) {
      throw new Error('Must provide email and password')
    }

    const user = await studentModel.findOne({ email })
    if (!user) {
      throw new Error('Invalid Credentials')
    }

    const isPasswordCorrect = user.comparePassword(password)
    if (!isPasswordCorrect) {
      throw new Error('Invalid Credentials')
    }

    const tokenUser = jwt.createTokenUser(user as unknown as User)
    jwt.attachCookies({ res, user: tokenUser })
    res.status(200).json(tokenUser)
  }
}

export default new StudentAuthController()
