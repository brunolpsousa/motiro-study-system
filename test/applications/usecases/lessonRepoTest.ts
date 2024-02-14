import { LessonRepository } from '@repositories'
import { Lesson, LessonFile } from 'user/dto/user-entities.dto'
import { dateId, dateId2 } from './instructorRepoTest'

const lessons: Lesson[] = [
  {
    id: 'testId',
    instructorId: 'testId',
    studentId: 'testId',
    dateId: dateId.toString(),
    files: []
  },
  {
    id: 'testId2',
    instructorId: 'testId2',
    studentId: 'testId2',
    dateId: dateId2.toString(),
    files: []
  }
]

export class LessonRepoTest implements LessonRepository {
  async findById(id: string): Promise<Lesson | null> {
    for (const lesson of lessons) {
      if (lesson.id === id) return lesson
    }
    return null
  }
  async findAll(): Promise<Lesson[]> {
    const result: Lesson[] = []
    for (const lesson of lessons) {
      result.push(lesson)
    }
    return result
  }
  async save(lesson: Lesson): Promise<Lesson> {
    const result: Lesson = new Lesson(lesson)
    lessons.push(result)
    return result
  }
  async uploadFile(id: string, file: LessonFile): Promise<void> {
    for (const lesson of lessons) {
      if (lesson.id === id) lesson.files.push(file)
    }
  }
  async delete(id: string): Promise<void> {
    for (let i = 0; i < lessons.length; i++) {
      if (lessons[i].id === id) {
        lessons.splice(i, 1)
      }
    }
  }
  async count(): Promise<number> {
    return lessons.length
  }
}
