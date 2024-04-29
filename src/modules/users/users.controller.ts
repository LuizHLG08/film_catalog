import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { AuthRequest } from 'src/auth/models/auth.request';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilmsResponseDto } from '../films/dto/films-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FilmsResponseDto,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return res.status(201).json(await this.usersService.create(createUserDto));
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [FilmsResponseDto],
    description: 'Users successfully found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('AUTH')
  async findAll(@Res() res: Response) {
    return res.status(200).json(await this.usersService.findAll());
  }

  @Patch()
  @ApiResponse({
    status: HttpStatus.OK,
    type: FilmsResponseDto,
    description: 'Updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('AUTH')
  async update(@Req() req : AuthRequest, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    return res.status(200).json(await this.usersService.update(req.user.id, updateUserDto));
  }

  @Delete()
  @ApiResponse({
    status: 204,
    description: 'Successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('AUTH')
  async remove(@Req() req : AuthRequest, @Res() res: Response) {
    await this.usersService.remove(req.user.id)
    return res.status(204);
  }
}
