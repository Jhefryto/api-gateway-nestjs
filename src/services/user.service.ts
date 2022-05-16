import { Inject, Injectable, Scope } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDtos, UserDtos } from 'src/dtos/user.dtos';
import { Express } from 'express';
import * as fs from 'fs';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject('MICRO_USER') private readonly userMicroServices: ClientProxy,
    @Inject('MICRO_DIGITAL') private readonly fileMicroServices: ClientProxy,
    @Inject('MICRO_MAIL') private readonly mailMicroServices: ClientProxy,
  ) {}

  async findAll(dbname: string, page: number, perPage: number, query: string) {
    const result = await this.userMicroServices
      .send<any[]>({ cmd: 'get_All' }, { dbname, page, perPage, query })
      .toPromise();
    return result;
  }

  async findOne(id: number, dbname: string) {
    const result = await this.userMicroServices
      .send<any>({ cmd: 'get_One' }, { id, dbname })
      .toPromise();
    return result;
  }

  async insert(dbname: string, newUser: UserDtos, file: Express.Multer.File) {
    const result = await this.userMicroServices
      .send<any>({ cmd: 'create_user' }, { dbname, newUser, file })
      .toPromise();
    if ('username' in result) {
      await this.mailMicroServices.emit('new_user', result);
    }
    return result;
  }

  async update(
    id: number,
    dbname: string,
    newUser: UpdateUserDtos,
    file: Express.Multer.File,
  ) {
    const result = await this.userMicroServices
      .send<any>({ cmd: 'update_user' }, { id, dbname, newUser, file })
      .toPromise();
    return result;
  }

  async delete(id: number, dbname: string) {
    const result = await this.userMicroServices
      .send<any>({ cmd: 'delete_user' }, { id, dbname })
      .toPromise();
    return result;
  }

  async exportaExcel() {
    const result = await this.fileMicroServices
      .send<any>({ cmd: 'export_user' }, { data: 'hola' })
      .toPromise();
    const myPathFile = 'downloads/reporte.xlsx';
    const buff = new Buffer(result.data);
    fs.writeFileSync(myPathFile, buff);
    return myPathFile;
  }
}
