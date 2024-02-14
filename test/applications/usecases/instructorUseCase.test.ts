import { InstructorRepoTest } from './instructorRepoTest'
import { InstructorUseCase } from '@usecases'
import { Instructor } from 'user/dto/user-entities.dto'

const instructorUseCase = new InstructorUseCase(new InstructorRepoTest())
let instructorRepo: InstructorRepoTest

const instructorObj: Instructor = {
  id: '123456789',
  name: 'InstructorTest',
  email: 'instructortest@mail.com',
  password: 'secret',
  specialty: ['math'],
  schedule: [
    {
      date: new Date('2023-09-29'),
      busy: true
    },
    {
      date: new Date('2023-09-29'),
      busy: true
    }
  ],
  role: 'instructor'
}

beforeEach(() => {
  instructorRepo = new InstructorRepoTest()
})

describe('InstructorController', () => {
  it('should be defined', () => {
    expect(instructorUseCase).toBeDefined()
  })

  it('should be object', () => {
    const newInstructor = instructorUseCase.create(instructorObj)
    expect(newInstructor).toBeInstanceOf(Object)
  })

  it('should be created', async () => {
    const newInstructor = instructorObj

    const createdInstructor = async () =>
      await instructorUseCase.create(newInstructor)

    expect(() => createdInstructor()).toBeDefined()
  })

  it('should list one', async () => {
    const instructorId = 'testId'

    const findInstructor = await instructorUseCase.listOne(instructorId)

    expect(findInstructor).toBeDefined()
  })

  it('should list all', async () => {
    const instructors = await instructorUseCase.listAll()

    expect(instructors).toBeDefined()
  })

  it('should be updated', async () => {
    const updateInstructor: Instructor = {
      id: 'testId',
      name: 'UpdatedInstructor',
      email: 'updatedinstructor@mail.com',
      password: 'updatedsecret',
      specialty: ['math', 'filosofy'],
      schedule: [
        {
          date: new Date('2023-09-30'),
          busy: false
        },
        {
          date: new Date('2023-09-14'),
          busy: true
        }
      ],
      role: 'instructor'
    }

    await instructorUseCase.update('testId', updateInstructor)

    const findInstructor = await instructorRepo.findById('testId')

    expect(findInstructor).toEqual(updateInstructor)
  })

  it('should be deleted', async () => {
    const instructorId = 'testId'

    await instructorUseCase.delete(instructorId)

    const deletedInstructor = await instructorRepo.findById(instructorId)

    expect(deletedInstructor).toBeNull()
  })

  it('should throw an error if the id does not exist when listOne', async () => {
    const nonExistentId = 'falseId'

    await expect(instructorUseCase.listOne(nonExistentId)).rejects.toThrow(
      'Instructor not found'
    )
  })

  it('should throw an error if the id does not exist when update', async () => {
    const nonExistentId = 'falseId'
    const existingInstructor = instructorObj

    if (!(await instructorRepo.findById(nonExistentId))) {
      await expect(
        instructorUseCase.update(nonExistentId, existingInstructor)
      ).rejects.toThrow('Instructor not found')
    }
  })

  it('should throw an error if the id does not exist when delete', async () => {
    const nonExistentId = 'falseId'

    if (!(await instructorRepo.findById(nonExistentId))) {
      await expect(instructorUseCase.delete(nonExistentId)).rejects.toThrow(
        'Instructor not found'
      )
    }
  })

  it('should be saved', async () => {
    const newInstructor = instructorObj

    const createdInstructor = await instructorUseCase.create(newInstructor)

    const instructors = await instructorRepo.findAll()

    const isInstructorInList = instructors.some(
      instructor => instructor.id === createdInstructor.id
    )

    expect(isInstructorInList).toBe(true)
  })

  it('should compare passwords correctly for the same password', async () => {
    const newInstructor = instructorObj

    await instructorRepo.save(newInstructor)

    const isPasswordCorrect = await instructorUseCase.comparePassword(
      'testId2',
      'secret2'
    )

    expect(isPasswordCorrect).toBe(true)
  })

  it('should compare passwords correctly for different passwords', async () => {
    const newInstructor = instructorObj

    await instructorRepo.save(newInstructor)

    const isPasswordCorrect = await instructorUseCase.comparePassword(
      'testId',
      'wrongpassword'
    )

    expect(isPasswordCorrect).toBe(false)
  })

  it('should count documents when there are users', async () => {
    const count = await instructorRepo.count()
    expect(count).toBeGreaterThan(0)
  })
})
