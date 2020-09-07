import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';

// load ENV variables
dotenv.config();

// create and start a server based on a `Module`
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('comingsoonseries.backoffice.com API')
    .setDescription('comingsoonseries.backoffice.com API description')
    .setVersion('1.0')
    .addTag('comingsoonseries.backoffice.com')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}

// it starts everything
bootstrap();
