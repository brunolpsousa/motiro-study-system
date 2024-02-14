import { Schema, model } from 'mongoose'
import { UserSchema } from '.'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcrypt'

const UserSchema = new Schema(
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
    specialty: [
      {
        type: String,
        required: false,
        trim: true,
        minlength: 1,
        maxlength: 20
      }
    ],
    schedule: [
      {
        date: {
          type: Date,
          required: [false, 'YYYY-MM-DD HH:mm']
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
      enum: ['user', 'instructor', 'admin'],
      default: 'user'
    }
  },
  {
    toJSON: {
      virtuals: true,
      timestamps: true,
      transform: (
        _,
        ret: { _id?: Schema.Types.ObjectId; password?: string }
      ) => {
        delete ret.password
        return ret
      }
    },
    toObject: { virtuals: true, timestamps: true }
  }
)

UserSchema.methods.comparePassword = async function (
  canditatePassword: string
) {
  return await bcrypt.compare(canditatePassword, this.password)
}

UserSchema.virtual('lessons', {
  ref: 'Lessons',
  localField: '_id',
  foreignField: 'user',
  justOne: false
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const { BCRYPT_SALT } = process.env
  const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT as string))
  this.password = await bcrypt.hash(this.password, salt)
})

export const userModel = model<UserSchema>('User', UserSchema)
