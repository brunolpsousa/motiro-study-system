import { Request, Response } from 'express'

export default abstract class BaseAuthController {
  abstract register(req: Request, res: Response): object
  abstract login(req: Request, res: Response): object

  async logout(_: Request, res: Response) {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date()
    })
    res.status(200).send()
  }
}

