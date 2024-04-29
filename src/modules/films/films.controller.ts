import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { AuthRequest } from 'src/auth/models/auth.request';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Films } from './entities/films.entity';
import { FilmsResponseDto } from './dto/films-response.dto';

@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @ApiBody({
    type: CreateFilmDto
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FilmsResponseDto,
    description: 'User registered successfully',
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
  async create(@Req() req : AuthRequest ,@Body() createFilmDto: CreateFilmDto, @Res() res : Response) {
    return res.status(201).json(await this.filmsService.create(req.user ,createFilmDto));
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [FilmsResponseDto],
    description: 'Successfully found',
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
  async findAll(@Res() res : Response) {
    return res.status(200).json(await this.filmsService.findAll());
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Enter unique id',
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FilmsResponseDto,
    description: 'Successfully found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('AUTH')
  async findOne(@Param('id') id: string, @Res() res : Response) {
    return res.status(200).json(await this.filmsService.findOne(id));
  }


  @Patch(':id')
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
    status: HttpStatus.NOT_FOUND,
    description: 'Not found!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('AUTH')
  async update(@Param('id') id: string, @Req() req : AuthRequest, @Body() updateFilmDto: UpdateFilmDto, @Res() res : Response) {
    return res.status(200).json(await this.filmsService.update(id, req.user.id, updateFilmDto));
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('AUTH')
  async remove(@Param('id') id: string, @Req() req : AuthRequest, @Res() res : Response) {
    await this.filmsService.remove(id, req.user.id)
    return res.status(204);
  }
}
