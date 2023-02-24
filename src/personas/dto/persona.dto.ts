import { IsNotEmpty, IsEmail, IsNumber, IsDateString, IsISO8601 } from 'class-validator';

export class CreatePersonaDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;

  @IsNotEmpty()
  @IsNumber()
  edad: number;

  @IsNotEmpty()
  @IsNumber()
  mes_nacimiento: number;

  @IsNumber()
  @IsNotEmpty()
  dia_nacimiento: number;
}

export class ValidateCodigoDto {
  @IsNotEmpty()
  codigo: string;

  @IsNotEmpty()
  persona_id: number;
}

export class FiltrarPersonaFechaDto {
  @IsNotEmpty()
  @IsISO8601()
  fecha_inicio: Date;

  @IsNotEmpty()
  @IsISO8601()
  fecha_fin: Date;
}
