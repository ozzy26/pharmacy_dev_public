import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import {useContainer} from 'class-validator';
import { AppModule } from './base/app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter()
  );

  const options = new DocumentBuilder()
    .setTitle('Listado - APIS')
    .setDescription('Aqui estan todas las APIS')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}

bootstrap();
