import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginAuthDto } from 'src/dtos/auth.dtos';
import { AuthService } from 'src/services/auth.service';

import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @Get('exporta')
  //   async login(@Res() response: Response, @Body() data: LoginAuthDto) {
  //     const resul = await this.authService.login(data);
  //     if ('error' in resul) {
  //       response.status(401).send(resul);
  //     } else {
  //       response.status(202).send(resul);
  //     }
  //   }
}
