import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PersonasService } from './personas.service';
import {
  CreatePersonaDto,
  FiltrarPersonaFechaDto,
  ValidateCodigoDto,
} from './dto/persona.dto';
import { Persona } from './entities/persona.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Get('filter')
  @UseGuards(new AuthGuard())
  consultarPorFecha(
    @Body('data') data: FiltrarPersonaFechaDto,
  ): Promise<Persona[]> {
    return this.personasService.consultarPorFecha(data);
  }

  @Post('create')
  crearPersona(@Body('data') data: CreatePersonaDto) {
    return this.personasService.crearPersona(data);
  }

  @Post('validate')
  validarCodigoVerificacion(@Body('data') data: ValidateCodigoDto) {
    return this.personasService.validarCodigoVerificacion(data);
  }
}
