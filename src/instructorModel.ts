import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

interface Instructor extends Schema {
  comparePassword(password: string): boolean
}

const InstructorSchema = new Schema(
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
    specialty: [
      {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 20
      }
    ],
    schedule: [
      {
        date: {
          type: Date,
          required: [true, 'YYYY-MM-DD HH:mm']
        },
        busy: {
          type: Boolean,
          default: false
        }
      }
    ],
    role: {
      type: String,
      required: true,
      enum: ['instructor'],
      default: 'instructor'
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

InstructorSchema.methods.comparePassword = async function (
  canditatePassword: string
) {
  return await bcrypt.compare(canditatePassword, this.password)
}

InstructorSchema.virtual('lessons', {
  ref: 'Lessons',
  localField: '_id',
  foreignField: 'instructor',
  justOne: false
})

InstructorSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const { BCRYPT_SALT } = process.env
  const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT as string))
  this.password = await bcrypt.hash(this.password, salt)
})

export const instructorModel = model<Instructor>('Instructor', InstructorSchema)
