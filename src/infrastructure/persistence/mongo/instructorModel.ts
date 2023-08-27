import { Schema, model } from 'mongoose'
import isEmail from 'validator/lib/isEmail'

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
    ]
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

InstructorSchema.virtual('lessons', {
  ref: 'Lessons',
  localField: '_id',
  foreignField: 'instructor',
  justOne: false
})

export const instructorModel = model('Instructor', InstructorSchema)
