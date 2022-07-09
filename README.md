# Nest JS

[Official Docs](https://docs.nestjs.com/)

# Basics

1. Nest
   ```
   npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata typescript
   ```
   - Lots of packages to get nest rolling!
1. We will be using Express for our http implementation
1. Reflect-metadata allows us to use decorators

npm install @nestjs/common@7.6.17 @nestjs/core@7.6.17 @nestjs/platform-express@7.6.17 reflect-metadata@0.1.13 typescript

# Nest CLI

1. Create new project from nest CLI
   ```
   nest new [projecName]
   ```
1. Create nest module
   ```
   nest generate module messages
   ```
1. Create controller
   ```
   nest generate controller messages/messages --flat
   ```
   - --flat does not create a 'controllers' folder
1. We are using REST Client extension to test our
   - Extension is separate
   - You create `requests.http` files to generate your test requests

# Valiating Request Data

1. ValidationPipe is common with nest
1. Must install the following:
   ```
   npm install class-validator class-transformer
   ```
1. Similar to .net, we create a DTO/Model object that does our ValidationPipe
   ```ts
   import { IsString } from 'class-validator';

   export class CreateMessageDto {
   	@IsString()
   	content: string;
   }
   ```
1. We then use this object as inputs to our controller endpoints
   ```ts
   import { Controller, Get, Post, Body, Param } from '@nestjs/common';
   import { CreateMessageDto } from './dtos/create-message.dto';

   @Controller('messages')
   export class MessagesController {
   @Get()
   listMessages() {
      return 'message';
   }

   @Post()
   createMessage(@Body() body: CreateMessageDto) {
      console.log(body);
   }

   @Get('/:id')
   getMessage(@Param('id') id: string) {
      console.log(id);
   }
   }
   ```
