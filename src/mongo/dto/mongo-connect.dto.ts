import { connect } from 'mongoose'

// const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const url = `mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`

const connectDb = async () => {
  return connect(url)
}

export { connectDb as connect }
