import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    return res.status(201).json(await this.usersService.create(createUserDto));
  }

  @Get()
  async findAll(@Res() res: Response) {
    return res.status(200).json(await this.usersService.findAll());
  }

  @Patch(':id')
  async update(@Res() res: Response, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return res.status(200).json(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    await this.usersService.remove(id)
    return res.status(204);
  }
}
