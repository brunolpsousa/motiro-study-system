import { Request, Response } from 'express'
import { adminModel, instructorModel, studentModel } from '@mongo/.'
import { jwt, User } from '@jwt/.'

const models = [adminModel, instructorModel, studentModel]

class AuthController {
  private getModel(req: Request) {
    const reqRole = req.body.role ?? req.body.user?.role
    const model =
      reqRole === 'admin'
        ? models[0]
        : reqRole === 'instructor'
        ? models[1]
        : reqRole === 'student'
        ? models[2]
        : null
    if (!model) throw new Error('Invalid role')
    return { model, reqRole }
  }

  private async isFirstAdminAccount() {
    const documents = await adminModel.countDocuments({})
    return documents === 0
  }

  private isAdminRole(token: string) {
    const { role } = jwt.decode(token) as User
    return role === 'admin'
  }

  async register(req: Request, res: Response) {
    const { model, reqRole } = this.getModel(req)
    const { name, email, password, specialty, schedule } = req.body
    const token = req.signedCookies.token

    const emailAlreadyExists = await model.findOne({ email })
    if (emailAlreadyExists) {
      throw new Error('E-mail already registered')
    }

    if (reqRole === 'admin') {
      if (!await this.isFirstAdminAccount() && !this.isAdminRole(token))
        throw new Error('Unauthorized')
    }

    const user = await model.create({
      name,
      email,
      password,
      specialty,
      schedule
    })

    const tokenUser = jwt.createUserToken(user as unknown as User)
    if (!token) jwt.attachCookies({ res, user: tokenUser })

    res.status(201).json(tokenUser)
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body
    if (!email || !password) {
      throw new Error('Missing credentials')
    }

    const getUser = async () => {
      for (const m of models) {
        const model = await m.findOne({ email })
        if (model) return model
      }
      throw new Error('User not found')
    }
    const user = await getUser()

    const isPasswordCorrect = user.comparePassword(password)
    if (!isPasswordCorrect) {
      throw new Error('Invalid password')
    }

    const userToken = jwt.createUserToken(user as unknown as User)
    jwt.attachCookies({ res, user: userToken })

    res.status(200).json(userToken)
  }

  async logout(_: Request, res: Response) {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date()
    })
    res.status(200).send()
  }
}

export default new AuthController()
