import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

// @Exclude()
export class UserDtos {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsPositive()
  @IsNotEmpty()
  readonly id_role: number;
}

export class UpdateUserDtos extends PartialType(UserDtos) {}
