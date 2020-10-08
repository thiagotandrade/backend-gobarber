import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    await updateProfileService.execute({
      user_id: user.id,
      name: 'Johnny Duh',
      email: 'johnny@duh.com',
    });

    expect(user.name).toBe('Johnny Duh');
    expect(user.email).toBe('johnny@duh.com');
  });

  it('should not be able to show the profile from nonexistent user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'nonexistent-user-id',
        name: 'Nonexistent User',
        email: 'test@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@example.com',
      password: '123123',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Johnny Duh',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    await updateProfileService.execute({
      user_id: user.id,
      name: 'Johnny Duh',
      email: 'johnny@duh.com',
      old_password: '123123',
      password: '123456',
    });

    expect(user.password).toBe('123456');
  });

  it('should be not able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Johnny Duh',
        email: 'johnny@duh.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Johnny Duh',
        email: 'johnny@duh.com',
        old_password: 'wrong-old-password',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
