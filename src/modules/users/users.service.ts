import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) {}

  async create(createUserDto: CreateUserDto) : Promise<Users> {
    const user = await this.usersRepository.save(createUserDto)
    return {
      ...user,
      password: undefined
    };
  }

  async findAll(): Promise<Users[]> {
    const users = await this.usersRepository.find();
    const responseUsers = users.map(user => {
      return {
        ...user,
        password: undefined
      }
    })
    return responseUsers;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({where: { email : email }});

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateResult = await this.usersRepository.update({ id }, updateUserDto);

    if (updateResult.affected > 0) {
        const updatedUser = await this.usersRepository.findOne({where : {id : id}});
        return {
          ...updatedUser,
          password: undefined,
          updatedAt: new Date()
        };
    } else {
        throw new Error('User not found or not updated.');
    }
  }

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }
}
