import { AdminRepoTest } from './adminRepoTest'
import { AdminUseCase } from '@usecases'
import { Admin } from 'user/dto/user-entities.dto'

const adminUseCase = new AdminUseCase(new AdminRepoTest())
let adminRepo: AdminRepoTest

const adminObj: Admin = {
  name: 'AdminTest',
  email: 'admintest@mail.com',
  password: 'secret',
  role: 'admin'
}

beforeEach(() => {
  adminRepo = new AdminRepoTest()
})

describe('AdminController', () => {
  it('should be defined', () => {
    expect(adminUseCase).toBeDefined()
  })

  it('should be object', () => {
    const newAdmin = adminUseCase.create(adminObj)
    expect(newAdmin).toBeInstanceOf(Object)
  })

  it('should be created', async () => {
    const newAdmin = adminObj

    const createdAdmin = await adminUseCase.create(newAdmin)

    expect(createdAdmin).toBeDefined()
  })

  it('should list one', async () => {
    const adminId = 'testId'

    const findAdmin = await adminUseCase.listOne(adminId)

    expect(findAdmin).toBeDefined()
  })

  it('should list all', async () => {
    const admins = await adminUseCase.listAll()

    expect(admins).toBeDefined()
  })

  it('should be updated', async () => {
    const updateAdmin: Admin = {
      id: 'testId',
      name: 'UpdatedAdmin',
      email: 'updatedadmin@mail.com',
      password: 'updatedsecret',
      role: 'admin'
    }

    await adminUseCase.update(updateAdmin)

    const findAdmin = await adminRepo.findById('testId')

    expect(findAdmin).toEqual(updateAdmin)
  })

  it('should be deleted', async () => {
    const adminId = 'testId'

    await adminUseCase.delete(adminId)

    const deletedAdim = await adminRepo.findById(adminId)

    expect(deletedAdim).toBeNull()
  })

  it('should throw an error if the id does not exist when listOne', async () => {
    const nonExistentId = 'falseId'

    await expect(adminUseCase.listOne(nonExistentId)).rejects.toThrow(
      'Admin not found'
    )
  })

  it('should throw an error if the id does not exist when update', async () => {
    const nonExistentId = 'falseId'
    const existingAdmin = adminObj

    if (!(await adminRepo.findById(nonExistentId))) {
      await expect(
        adminUseCase.update({ id: nonExistentId, ...existingAdmin })
      ).rejects.toThrow('Admin not found')
    }
  })

  it('should throw an error if the id does not exist when delete', async () => {
    const nonExistentId = 'falseId'

    if (!(await adminRepo.findById(nonExistentId))) {
      await expect(adminUseCase.delete(nonExistentId)).rejects.toThrow(
        'Admin not found'
      )
    }
  })

  it('should throw an error if admin already exists', async () => {
    const existingAdmin = adminObj

    if (await adminRepo.findById('testId')) {
      await expect(adminUseCase.create(existingAdmin)).rejects.toThrow(
        'Admin already exists'
      )
    }
  })

  it('should be saved', async () => {
    const newAdmin = adminObj

    const createdAdmin = await adminUseCase.create(newAdmin)

    const students = await adminRepo.findAll()

    const isAdminInList = students.some(admin => admin.id === createdAdmin.id)

    expect(isAdminInList).toBe(true)
  })

  it('should compare passwords correctly for the same password', async () => {
    const newAdmin = adminObj

    await adminRepo.save(newAdmin)

    const isPasswordCorrect = await adminUseCase.comparePassword(
      'testId2',
      'secret2'
    )

    expect(isPasswordCorrect).toBe(true)
  })

  it('should compare passwords correctly for different passwords', async () => {
    const newAdmin = adminObj

    await adminRepo.save(newAdmin)

    const isPasswordCorrect = await adminUseCase.comparePassword(
      'testId',
      'wrongpassword'
    )

    expect(isPasswordCorrect).toBe(false)
  })

  it('should count documents when there are users', async () => {
    const count = await adminRepo.count()
    expect(count).toBeGreaterThan(0)
  })
})
