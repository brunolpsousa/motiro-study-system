import { Lesson } from './lesson.dto'

export abstract class LessonRepository {
  abstract findById(id: string): Promise<Lesson | null>
  abstract findAll(): Promise<Lesson[]>
  abstract save(lesson: Lesson): Promise<Lesson>
  abstract uploadFile(id: string, file: object): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract count(): Promise<number>
}
