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
1. Set up middleware
   ```ts
   import { NestFactory } from '@nestjs/core';
   import { ValidationPipe } from '@nestjs/common';
   import { AppModule } from './app.module';

   async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
      }),
   );
   await app.listen(3000);
   }
   bootstrap();
   ```
   - Whitelist removes additional json inputs that aren't expectec
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

# Nest Architecture: Services and Repositories

1. Design follows similar mvc conventions
   - Controller -> Service -> Repository
   - Repository is the data layer
   - Service is the business layer
## Dependency Injection
   
1. Nest does not have classes create dependencies
   - You **can**, but similar to .net core, you shouldn't
   - It's built to use DI
   - Similar to how I've used it before...define an interface and pass in as parameter to constructor
1. Inversion of Control Principle
   - Classes should not create intances of its dependencies on its own
1. Adding classes to DI Container
   ```ts
   import { Module } from '@nestjs/common';
   import { MessagesController } from './messages.controller';
   import { MessagesService } from './messages.service';
   import { MessagesRepository } from './messages.repository';

   @Module({
   controllers: [MessagesController],
   providers: [MessagesService, MessagesRepository],
   })
   export class MessagesModule {}
   ```
1. Setting class as injectable
   ```ts
   import { Injectable } from '@nestjs/common';
   import { MessagesRepository } from './messages.repository';

   @Injectable()
   export class MessagesService {
   constructor(private readonly messagesRepo: MessagesRepository) {}
   }
   ```

# Nest and Persistent Data

1. TypeORM and Mongoose
   - Both work very well w/ Nest
1. We will be using TypeORM
   - Use SQLite for now
   - Eventually swap to Postgres
1. Installation
   ```
   npm install @nestjs/typeorm typeorm sqlite3
   ```

# Custom Data Serialization

1. We are solving a specific problem with returning data
   - How do we control what is returned in our response
1. Nest recommends controlling through the entity
   - Using `Exclude` from `class-transformer`
   ```ts
   @Column()
   @Exclude()
   password: string;
   ```
   - Also by using built in interceptors
   ```ts
   @UseInterceptors(ClassSerializerInterceptor)
   @Get('/:id')
   async findUser(@Param('id') id: string) {
      const user = await this.usersService.findOne(parseInt(id));
      if (!user) {
         throw new NotFoundException('user not found');
      }

      return user;
   }
   ```
1. The weakenss is:
   - What if we want to sometimes return password? (think admin)
   - This approach does not allow us to do that
1. The solution is to not use the entity, but to create custom interceptors and dtos

## Interceptors

1. Applied to a single handler
   - For all incoming requests, or outgoing responses (or not, you can control)

```ts
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<T> {
    return next.handle().pipe(
      map((data: T) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
```

1. This is a generic implementation
1. We pass in the dto we want to deserialize to:
   ```ts
   @Serialize(UserDto)
   @Controller('auth')
   export class UsersController {
      ...
   }
   ```
1. Here is our Dto:
   ```ts
   import { Expose } from 'class-transformer';

   export class UserDto {
   @Expose()
   id: number;

   @Expose()
   email: string;
   }
   ```
   - We are being specific by which properties we want to see with `Expose`

# Testing

## Unit Testing

1. We are using the built in jest testing framework that nest comes with
1. We run `npm run test:watch` and define which file we want to run
   - Or we can run them all
1. We create a `*.spec.ts` file that contains our tests
   - Reference the `auth.service.spec.ts` file
1. In terms of mocks, we are building our own depending on which class we are testing
   - Auth service mocks out the `user.service.ts` class
1. It looks like there is a separate test folder (when creating a nest project from template)...is that for unit testing or for integration?


## Integration Testing

1. These tests belong in the 'test' folder
1. We run `npm run test:e2e` and define which file we want to run
1. We will be creating 2 databases (sqlite)
   - One for development
   - One for testing
   - This will require us to do environment config in the nest way (which is complicated and over the top)

# App Configuration