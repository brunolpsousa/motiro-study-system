import { ObjectId } from 'mongoose'

export type Schedule = {
  _id?: ObjectId
  date?: Date
  busy: boolean
}

export class User {
  public readonly id?: string
  public name: string
  public email: string
  public password?: string
  public specialty?: string[]
  public schedule?: Schedule[]
  public role?: string

  constructor(props: Omit<User, 'id'>, id?: string) {
    this.name = props.name
    this.email = props.email
    this.password = props.password
    this.specialty = props.specialty
    this.schedule = props.schedule
    this.role = props.role

    if (id) this.id = id
    if (!props.role) this.role = 'user'
  }
}
