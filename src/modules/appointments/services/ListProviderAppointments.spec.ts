import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointments';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 9, 10, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 9, 10, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      month: 10,
      year: 2020,
      day: 10,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });

  it('should be able to list the provider appointments from cache', async () => {
    await fakeCacheProvider.save(
      'provider-appointments:user2:2020-10-10',
      JSON.stringify(['appointment']),
    );

    const findAllInDayFromProvider = jest.spyOn(
      fakeAppointmentsRepository,
      'findAllInDayFromProvider',
    );

    await listProviderAppointments.execute({
      provider_id: 'user2',
      year: 2020,
      month: 10,
      day: 10,
    });

    await expect(findAllInDayFromProvider).toHaveBeenCalledTimes(0);
  });
});
