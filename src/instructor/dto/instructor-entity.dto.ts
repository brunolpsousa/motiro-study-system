import { ObjectId } from 'mongoose'

export class Instructor {
  public readonly id?: string
  public name: string
  public email: string
  public password?: string
  public specialty: string[]
  public schedule: Schedule[]
  public role?: string

  constructor(props: Omit<Instructor, 'id'>, id?: string) {
    this.name = props.name
    this.email = props.email
    this.password = props.password
    this.specialty = props.specialty
    this.schedule = props.schedule
    this.role = 'instructor'

    if (id) {
      this.id = id
    }
  }
}

export type Schedule = {
  _id?: ObjectId
  date?: Date
  busy: boolean
}
