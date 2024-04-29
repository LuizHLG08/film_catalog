import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { Repository } from 'typeorm';
import { Films } from './entities/films.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFilmDto } from './dto/create-film.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockFilmDto: CreateFilmDto = {
  name: 'Test Film',
  year: 2022,
  price: 10,
  description: 'Test Description',
};

const mockFilm: Films = new Films({
  id: '1',
  ...mockFilmDto,
  ownerId: 'user_id',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe('FilmsService', () => {
  let filmsService: FilmsService;
  let filmsRepository: Repository<Films>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: getRepositoryToken(Films),
          useValue: {
            save: jest.fn().mockResolvedValue(mockFilm),
            find: jest.fn().mockResolvedValue([mockFilm]),
            findOne: jest.fn().mockResolvedValue(mockFilm),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    filmsService = module.get<FilmsService>(FilmsService);
    filmsRepository = module.get<Repository<Films>>(getRepositoryToken(Films));
  });

  it('should be defined', () => {
    expect(filmsService).toBeDefined();
    expect(filmsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create a film', async () => {
      const createdFilm = await filmsService.create({} as any, mockFilmDto);

      expect(filmsRepository.save).toHaveBeenCalledWith({
        ...mockFilmDto,
        ownerId: undefined,
      });
      expect(createdFilm).toEqual({
        ...mockFilm,
      });
    });
  });

  describe('findAll', () => {
    it('should return a films list successfully', async () => {
      const filmsList = await filmsService.findAll();

      expect(filmsRepository.find).toHaveBeenCalled();
      expect(filmsList).toEqual([{
        ...mockFilm,
      }]);
    });
  });

  describe('update', () => {
    it('should be able to update a film', async () => {
      const updateFilmDto: any = { name: 'Updated Film' };

      const mockUpdatedFilm = { ...mockFilm, ...updateFilmDto };
      filmsRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      filmsRepository.findOne = jest.fn().mockResolvedValue(mockUpdatedFilm);

      const updatedFilm = await filmsService.update('1', 'user_id', updateFilmDto);

      expect(filmsRepository.update).toHaveBeenCalledWith({ id: '1' }, updateFilmDto);
      expect(filmsRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(updatedFilm).toEqual({
        ...mockUpdatedFilm,
      });
    });

    it('should throw an error when film is not found', async () => {
      filmsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(filmsService.update('invalid_id', 'user_id', {} as any)).rejects.toThrowError(NotFoundException);
    });

    it('should throw an error when user is not the owner', async () => {
      filmsRepository.findOne = jest.fn().mockResolvedValue({ ...mockFilm, ownerId: 'other_user_id' });

      await expect(filmsService.update('1', 'user_id', {} as any)).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should be able to delete a film', async () => {
      await filmsService.remove('1', 'user_id');

      expect(filmsRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error when film is not found', async () => {
      filmsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(filmsService.remove('invalid_id', 'user_id')).rejects.toThrowError(NotFoundException);
    });

    it('should throw an error when user is not the owner', async () => {
      filmsRepository.findOne = jest.fn().mockResolvedValue({ ...mockFilm, ownerId: 'other_user_id' });

      await expect(filmsService.remove('1', 'user_id')).rejects.toThrowError(UnauthorizedException);
    });
  });
});
