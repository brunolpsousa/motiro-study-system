import { Instructor } from 'domain/entities/instructor'

export interface InstructorRepository {
  findInstructorById(id: string): Promise<Instructor | null>
  saveInstructor(instructor: Instructor): Promise<Instructor>
  updateInstructor(instructor: Instructor): Promise<void>
  deleteInstructor(id: string): Promise<void>
}
