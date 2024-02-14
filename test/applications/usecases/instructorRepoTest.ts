import { InstructorRepository } from '@repositories'
import { Instructor, Schedule } from 'user/dto/user-entities.dto'
import { Types } from 'mongoose'

export const dateId = new Types.ObjectId()
export const dateId2 = new Types.ObjectId()

const users: Instructor[] = [
  {
    id: 'testId',
    name: 'InstructorTest',
    email: 'instructortest@mail.com',
    password: 'secret',
    specialty: ['math'],
    schedule: [
      {
        _id: dateId as any,
        date: new Date('2023-09-20'),
        busy: false
      },
      {
        _id: dateId2 as any,
        date: new Date('2023-09-21'),
        busy: true
      }
    ],
    role: 'instructor'
  },
  {
    id: 'testId2',
    name: 'InstructorTest2',
    email: 'instructortest@mail.com',
    password: 'secret2',
    specialty: ['math'],
    schedule: [
      {
        _id: dateId as any,
        date: new Date('2023-09-29'),
        busy: true
      },
      {
        _id: dateId2 as any,
        date: new Date('2023-09-18'),
        busy: true
      }
    ],
    role: 'instructor'
  }
]

export class InstructorRepoTest implements InstructorRepository {
  async findById(id: string): Promise<Instructor | null> {
    for (const user of users) {
      if (user.id === id) return user
    }
    return null
  }
  async findAll(): Promise<Instructor[]> {
    const instructors: Instructor[] = []
    for (const user of users) {
      instructors.push(user)
    }
    return instructors
  }
  async save(instructor: Instructor): Promise<Instructor> {
    const result = new Instructor(instructor)
    users.push(result)
    return result
  }
  async update(instructor: Instructor): Promise<void> {
    for (const user of users) {
      if (user.id === instructor.id) {
        user.name = instructor.name ?? user.name
        user.email = instructor.email ?? user.email
        user.password = instructor.password ?? user.password
        user.specialty = instructor.specialty ?? user.specialty
        user.schedule = instructor.schedule ?? user.schedule
      }
    }
  }
  async updateSchedule(id: string, schedule: Schedule): Promise<void> {
    for (const user of users) {
      if (user.id === id) {
        for (const s of user.schedule) {
          if (s._id === schedule._id) {
            s.busy = schedule.busy ?? s.busy
            s.date = schedule.date ?? s.date
          }
        }
      }
    }
  }
  async delete(id: string): Promise<void> {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        users.splice(i, 1)
      }
    }
  }
  async count(): Promise<number> {
    return users.length
  }
  async comparePassword(id: string, password: string): Promise<boolean> {
    for (const user of users) {
      if (user.id === id) return user.password === password
    }
    return false
  }
  whoAmI(): string {
    const user = new Instructor({
      name: '',
      email: '',
      specialty: [],
      schedule: []
    })
    return user.role || 'instructor'
  }
}
