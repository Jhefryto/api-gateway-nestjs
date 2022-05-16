import { Inject, Injectable, Scope } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { isEmpty, isNotEmpty } from 'class-validator';
import { LoginAuthDto } from 'src/dtos/auth.dtos';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(@Inject('MICRO_AUTH') private readonly authClient: ClientProxy) {}

  async login(dataLogin: LoginAuthDto) {
    const result = await this.authClient
      .send<any[]>({ cmd: 'get_login' }, dataLogin)
      .toPromise();
    return result;
  }
}
