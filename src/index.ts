import 'dotenv/config'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import { connect } from 'mongo/dto'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const { PORT, COOKIE_SECRET } = process.env
const port = PORT || 5000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser(COOKIE_SECRET))
  app.use(fileUpload())

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
    bootstrap()
  } catch (err) {
    console.log(err)
  }
})()
