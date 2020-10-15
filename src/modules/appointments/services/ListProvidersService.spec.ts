import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123123',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Quá',
      email: 'johnqua@example.com',
      password: '123123',
    });

    const users = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(users).toEqual([user1, user2]);
  });

  it('should be able to list the providers from cache', async () => {
    await fakeCacheProvider.save(`providers-list:user1`, 'Test');

    const save = jest.spyOn(fakeCacheProvider, 'save');

    await listProviders.execute({
      user_id: 'user2',
    });

    await listProviders.execute({
      user_id: 'user2',
    });

    expect(save).toHaveBeenCalledTimes(1);
  });
});
