import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import serverlessExpress from '@vendia/serverless-express'
import { Callback, Context, Handler } from 'aws-lambda'
import { AppModule } from './app.module'

let server: Handler

async function setupSwagger(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Web3 Parser x Signer')
    .setDescription('My REST API Documentation')
    .setVersion('1.0.0')

  const document = SwaggerModule.createDocument(app, documentBuilder.build())
  SwaggerModule.setup('/documentation', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  })
}

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule)
  setupSwagger(app)
  await app.init()

  const expressApp = app.getHttpAdapter().getInstance()
  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  event.path = event.path.includes('swagger-ui')
    ? `/documentation/dev${event.path}`
    : event.path

  server = server ?? (await bootstrap())
  return server(event, context, callback)
}

// import { INestApplication, Logger } from '@nestjs/common'
// import { NestFactory } from '@nestjs/core'
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
// import { AppModule } from './app.module'

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule)
//   setupSwagger(app)
//   await app.listen(process.env.APP_PORT, '0.0.0.0').then(async () => {
//     Logger.log(`✅  Application is running on: ${await app.getUrl()}`, 'NestJS')
//     Logger.log(`Swagger Documentation: ${await app.getUrl()}/documentation`)
//   })
// }
// bootstrap().catch((e) => {
//   Logger.error('❌  Error starting server', e, 'NestJS', false)
//   throw e
// })

// async function setupSwagger(app: INestApplication) {
//   const documentBuilder = new DocumentBuilder().setTitle('Web3 parser x signer')

//   const document = SwaggerModule.createDocument(app, documentBuilder.build())
//   SwaggerModule.setup('/documentation', app, document, {
//     swaggerOptions: {
//       persistAuthorization: true,
//       tagsSorter: 'alpha',
//       operationsSorter: 'method',
//     },
//   })
// }
