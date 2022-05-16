import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDtos, UserDtos } from 'src/dtos/user.dtos';
import { UserService } from 'src/services/user.service';
import { Response, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userServices: UserService) {}

  @Get('')
  async getAllUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('q') query: string,
    @Param('tenant') dbname: string,
  ) {
    const listUser = await this.userServices.findAll(
      dbname,
      page,
      perPage,
      query,
    );
    return listUser;
  }

  @Get('exportaExcel')
  @Header('Content-Type', 'text/xlsx')
  async exportaExcel(@Res() res: Response) {
    const result = await this.userServices.exportaExcel();
    res.download(result);
    return result;
  }

  @Get(':id')
  async getOneUser(@Param('id') id: number, @Param('tenant') dbname: string) {
    const user = await this.userServices.findOne(id, dbname);
    return user;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async insertUser(
    @Res() response: Response,
    @Body() newUser: UserDtos,
    @Param('tenant') dbname: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.userServices.insert(dbname, newUser, file);
    if ('error' in result) {
      response.status(400).send(result);
    } else {
      response.status(202).send(result);
    }
    return result;
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  async update(
    @Res() response: Response,
    @Param('id') id: number,
    @Body() newUser: Partial<UpdateUserDtos>,
    @Param('tenant') dbname: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.userServices.update(id, dbname, newUser, file);
    if ('error' in result) {
      response.status(400).send(result);
    } else {
      response.status(202).send(result);
    }
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Param('tenant') dbname: string) {
    const result = await this.userServices.delete(id, dbname);
    return result;
  }
}
