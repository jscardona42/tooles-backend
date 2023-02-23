import { IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  nombre_usuario: string;
  @IsNotEmpty()
  contrasena: string;
}

export class SignInUsuarioDto {
  @IsNotEmpty()
  nombre_usuario: string;
  @IsNotEmpty()
  contrasena: string;
}
