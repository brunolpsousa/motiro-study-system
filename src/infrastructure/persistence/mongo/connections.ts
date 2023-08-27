import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const url = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`

mongoose
  .connect(url)
  .then(() => console.log('database is working'))
  .catch(() => console.log('database is not working'))
