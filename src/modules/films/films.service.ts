import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Users } from '../users/entities/users.entity';
import { Films } from './entities/films.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';

@Injectable()
export class FilmsService {

  constructor(@InjectRepository(Films) private readonly filmsRepository: Repository<Films>) {}

  async create(user : Users,createFilmDto: CreateFilmDto) {

    
    const createdFilm = {
      ...createFilmDto,
      ownerId: user.id
    }

    return await this.filmsRepository.save(createdFilm)
  }

  async findAll() {
    return await this.filmsRepository.find()
  }

  async findOne(id: string) {
    return await this.filmsRepository.findOne({where : {id : id}});
  }

  async update(id: string, userId: string, updateFilmDto: UpdateFilmDto) {

    const film = await this.filmsRepository.findOne({where: {id : id}})

    if(!film) {
      throw new NotFoundException('Not found!')
    }

    if(film.ownerId !== userId) {
      throw new UnauthorizedException('No permission to update.')
    }
    
    const updateResult = await this.filmsRepository.update({ id }, updateFilmDto);

    if (updateResult.affected > 0) {
        const updatedUser = await this.filmsRepository.findOne({where : {id : id}});
        return {
          ...updatedUser,
          password: undefined,
        };
    } else {
        throw new Error('User not found or not updated.');
    }
  }

  async remove(id: string, userId: string) {

    const film = await this.filmsRepository.findOne({where: {id : id}})

    if(!film) {
      throw new NotFoundException('Not found!')
    }

    if(film.ownerId !== userId) {
      throw new UnauthorizedException('No permission to delete.')
    }

    return await this.filmsRepository.delete(id);
  }
}
