export class Lesson {
  public readonly id?: string
  public instructorId: string
  public studentId: string
  public dateId: string
  public files: LessonFile[]

  constructor(props: Omit<Lesson, 'id'>, id?: string) {
    this.instructorId = props.instructorId
    this.studentId = props.studentId
    this.dateId = props.dateId
    this.files = props.files

    if (id) this.id = id
  }
}

export type LessonFile = {
  id?: string
  name: string
  path: string
  uploadedBy: string
}
