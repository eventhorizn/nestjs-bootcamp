# Nest JS

[Official Docs](https://docs.nestjs.com/)

## Basics

1. Nest
   ```
   npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata typescript
   ```
   - Lots of packages to get nest rolling!
1. We will be using Express for our http implementation
1. Reflect-metadata allows us to use decorators

npm install @nestjs/common@7.6.17 @nestjs/core@7.6.17 @nestjs/platform-express@7.6.17 reflect-metadata@0.1.13 typescript

## Nest CLI

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
