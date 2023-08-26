import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

interface Student extends Schema {
  comparePassword(password: string): boolean
}

const StudentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['student'],
      default: 'student'
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

StudentSchema.methods.comparePassword = async function (
  canditatePassword: string
) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

StudentSchema.virtual('lessons', {
  ref: 'Lessons',
  localField: '_id',
  foreignField: 'student',
  justOne: false
})

StudentSchema.pre('save', async function () {
  this.role = 'student'
  const { BCRYPT_SALT } = process.env
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT as string))
  this.password = await bcrypt.hash(this.password, salt)
})

export const studentModel = model<Student>('Student', StudentSchema)
