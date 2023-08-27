import { Schema, model } from 'mongoose'
import { UserSchema } from '.'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcrypt'

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
      unique: true,
      validate: isEmail
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
  return await bcrypt.compare(canditatePassword, this.password)
}

StudentSchema.virtual('lessons', {
  ref: 'Lessons',
  localField: '_id',
  foreignField: 'student',
  justOne: false
})

StudentSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const { BCRYPT_SALT } = process.env
  const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT as string))
  this.password = await bcrypt.hash(this.password, salt)
})

export const studentModel = model<UserSchema>('Student', StudentSchema)
