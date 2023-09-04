export class Admin {
  public readonly id?: string
  public name: string
  public email: string
  public password?: string
  public role?: string

  constructor(props: Omit<Admin, 'id'>, id?: string) {
    this.name = props.name
    this.email = props.email
    this.password = props.password
    this.role = 'admin'

    if (id) {
      this.id = id
    }
  }
}
