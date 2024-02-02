import express from 'express'
import 'express-async-errors'
import 'dotenv/config'
import connect from 'infrastructure/persistence/mongo/connections'
import routes from './routes'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import { notFoundMiddleware, errorMiddleware } from 'applications/middlewares/.'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

const { PORT, COOKIE_SECRET } = process.env
const port = PORT || 5000
const appE = express()

appE.use(cookieParser(COOKIE_SECRET))
appE.use(express.json())
appE.use(fileUpload())
appE.use(routes)
appE.use(notFoundMiddleware)
appE.use(errorMiddleware)

const start = () =>
  appE.listen(port, async () => {
    console.log(`Server is listening on port ${port}`)
  })

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('Motirõ Study System')
    .setDescription('Class scheduling system.')
    .setVersion('3.0')
    .addTag('')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  await app.listen(port)
}

;(async function () {
  try {
    await connect()
    // start()
    bootstrap()
  } catch (err) {
    console.log(err)
  }
})()
