import { Request, Response } from 'express'
import BaseAuthController from './baseAuthController'
import { instructorModel } from 'instructorModel'
import { studentModel } from 'studentModel'
import { adminModel } from 'adminModel'
import { jwt, User } from '../../infrastructure/authentication/jwt'

class AuthController extends BaseAuthController {
  private getModel(req: Request) {
    const role = req.body.role ?? req.body.user?.role
    const model =
      role === 'instructor'
        ? instructorModel
        : role === 'student'
        ? studentModel
        : role === 'admin'
        ? adminModel
        : null
    if (!model) throw new Error('Invalid role')
    return { model, role }
  }

  async register(req: Request, res: Response) {
    const { model, role } = this.getModel(req)
    const { name, email, password, specialty, schedule } = req.body

    const emailAlreadyExists = await model.findOne({ email })
    if (emailAlreadyExists) {
      throw new Error('Email already exists')
    }

    const isFirstAccount = (await adminModel.countDocuments({})) === 0
    const isAdmin = role === 'admin'
    if (isAdmin && isFirstAccount) throw Error('First account must be admin')

    const user = await model.create({
      name,
      email,
      password,
      specialty,
      schedule
    })
    const tokenUser = jwt.createTokenUser(user as unknown as User)
    jwt.attachCookies({ res, user: tokenUser })

    res.status(201).json(tokenUser)
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body
    if (!email || !password) {
      throw new Error('Must provide email and password')
    }

    const getUser = async () => {
      const isStudent = await studentModel.findOne({ email })
      if (isStudent) return isStudent
      const isInstructor = await instructorModel.findOne({ email })
      if (isInstructor) return isInstructor
      const isAdmin = await adminModel.findOne({ email })
      if (isAdmin) return isAdmin
      throw new Error('Invalid Credentials')
    }

    const user = await getUser()

    const isPasswordCorrect = user.comparePassword(password)
    if (!isPasswordCorrect) {
      throw new Error('Invalid Credentials')
    }

    const tokenUser = jwt.createTokenUser(user as unknown as User)
    jwt.attachCookies({ res, user: tokenUser })

    res.status(200).json(tokenUser)
  }
}

export default new AuthController()
