import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import 'reflect-metadata';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    // create a fake copy of users service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('blah@blah.com', 'blah');

    expect(user.password).not.toEqual('blah');
    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email that is in use', async () => {
    await service.signup('blah@blah.com', 'blah');

    try {
      await service.signup('blah@blah.com', 'blah');
    } catch (err) {
      expect(err.toString()).toMatch('BadRequestException: email in use');
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin('blah@blah.com', 'blah');
    } catch (err) {
      expect(err.toString()).toMatch('NotFoundException: user not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('blah@blah.com', 'test');

    await expect(service.signup('blah@blah.com', 'blah')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('blah@blah.com', 'blah');

    const user = service.signin('blah@blah.com', 'blah');
    expect(user).toBeDefined();
  });
});
