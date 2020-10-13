import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentsService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentsService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentsService.execute({
      date: new Date(),
      provider_id: '123123',
      user_id: '111111',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 0, 1, 15);

    await createAppointmentsService.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: '111111',
    });

    await expect(
      createAppointmentsService.execute({
        date: appointmentDate,
        provider_id: '123123',
        user_id: '111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentsService.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: '123123',
        user_id: '111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
