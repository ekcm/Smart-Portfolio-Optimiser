import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Allow only your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Portfolio Optimizer Application API')
    .setDescription('core application in nestjs')
    .setVersion('1.0')
    .addTag('Portfolio Service')
    .addTag('Order Service')
    .addTag('Asset Service')
    .addTag('AssetPrice Service')
    .addTag("Core Service")
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(new ValidationPipe());

const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

}
bootstrap();
