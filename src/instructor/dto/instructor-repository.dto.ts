import { Instructor, Schedule } from '@entities'

export abstract class InstructorRepository {
  abstract findById(id: string): Promise<Instructor | null>
  abstract save(instructor: Instructor): Promise<Instructor>
  abstract update(instructor: Instructor): Promise<void>
  abstract updateSchedule(id: string, schedule: Schedule): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findAll(): Promise<Instructor[]>
  abstract count(): Promise<number>
  abstract comparePassword(id: string, password: string): Promise<boolean>
  abstract whoAmI(): string
}
