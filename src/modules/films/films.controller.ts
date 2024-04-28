import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { AuthRequest } from 'src/auth/models/auth.request';
import { Response } from 'express';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  async create(@Req() req : AuthRequest ,@Body() createFilmDto: CreateFilmDto, @Res() res : Response) {
    return res.status(201).json(await this.filmsService.create(req.user ,createFilmDto));
  }

  @Get()
  async findAll(@Res() res : Response) {
    return res.status(200).json(await this.filmsService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res : Response) {
    return res.status(200).json(await this.filmsService.findOne(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Req() req : AuthRequest, @Body() updateFilmDto: UpdateFilmDto, @Res() res : Response) {
    return res.status(200).json(await this.filmsService.update(id, req.user.id, updateFilmDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req : AuthRequest, @Res() res : Response) {
    await this.filmsService.remove(id, req.user.id)
    return res.status(204);
  }
}
