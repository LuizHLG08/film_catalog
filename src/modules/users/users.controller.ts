import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { AuthRequest } from 'src/auth/models/auth.request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return res.status(201).json(await this.usersService.create(createUserDto));
  }

  @Get()
  async findAll(@Res() res: Response) {
    return res.status(200).json(await this.usersService.findAll());
  }

  @Patch()
  async update(@Req() req : AuthRequest, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    return res.status(200).json(await this.usersService.update(req.user.id, updateUserDto));
  }

  @Delete()
  async remove(@Req() req : AuthRequest, @Res() res: Response) {
    await this.usersService.remove(req.user.id)
    return res.status(204);
  }
}
