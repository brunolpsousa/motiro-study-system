export class Lesson {
  public readonly id?: string
  public instructorId: string
  public studentId: string
  public date: Date

  constructor(props: Omit<Lesson, 'id'>, id?: string) {
    this.instructorId = props.instructorId
    this.studentId = props.studentId
    this.date = props.date

    if (id) {
      this.id = id
    }
  }
}
