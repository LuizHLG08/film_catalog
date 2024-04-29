import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
    new ValidationPipe({
      transform: true,
      transformOptions: { groups: ['transform']}
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Docs - Catálogo de Filmes')
    .setDescription(
      'Este é um projeto de uma API de um catálogo de filmes, utilizando Nest.js, TypeORM e PostgreSQL como banco de dados.As rotas da API tem autenticação, então para acessar os endpoints é necessário fazer login com um usuário e senha válidos. A API utiliza um algorítmo avançado de verificação, então o usuário logado só poderá alterar o próprio perfil, ou filmes postados por ele, ainda é possível acessar filmes postados por outros usuários, porém não é possível auterá-los.',
    )
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JTW',
      name: 'Authorization',
      description: 'Enter token',
      in: 'header'
    }, 'AUTH')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
