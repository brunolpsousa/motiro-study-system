import { Schema, model } from 'mongoose'

const LessonSchema = new Schema(
  {
    instructorId: {
      type: Schema.ObjectId,
      ref: 'Instructor',
      required: true
    },
    studentId: {
      type: Schema.ObjectId,
      ref: 'Student',
      required: true
    },
    dateId: {
      type: Schema.ObjectId,
      ref: 'Date',
      required: true
    },
    files: [
      {
        name: String,
        path: String,
        uploadedBy: Schema.ObjectId
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      timestamps: true,
      transform: (_, ret: { _id?: Schema.Types.ObjectId }) => {
        delete ret._id
        return ret
      }
    },
    toObject: { virtuals: true, timestamps: true }
  }
)

export const lessonModel = model('Lessons', LessonSchema)
