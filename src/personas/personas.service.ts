import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import {
  CreatePersonaDto,
  FiltrarPersonaFechaDto,
  ValidateCodigoDto,
} from './dto/persona.dto';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonasService {
  constructor(
    private prismaService: PrismaService,
    private notificacionesService: NotificacionesService,
  ) {}

  async consultarPorFecha(data: FiltrarPersonaFechaDto) {
    let fecha_inicio = new Date(data.fecha_inicio);
    let fecha_fin = new Date(data.fecha_fin);

    return this.prismaService.personas.findMany({
      where: {
        fecha_nacimiento: { gte: fecha_inicio, lte: fecha_fin },
        verificado: true,
      },
      select: {
        persona_id: true,
        nombre: true,
        correo_electronico: true,
        edad: true,
        fecha_nacimiento: true,
      },
    });
  }

  async crearPersona(data: CreatePersonaDto) {
    let persona: Persona;
    let anio = await this.calcularAnioNacimiento(
      data.edad,
      data.mes_nacimiento,
      data.dia_nacimiento,
    );

    let mes = data.mes_nacimiento.toString();
    let dia = data.dia_nacimiento.toString();
    let codigo = this.generarCodigoAleatorio(1, 999999);

    let fecha_nacimiento = new Date(`${anio}-${mes}-${dia}`);
    let params = { codigo: codigo };

    try {
      persona = await this.prismaService.personas.create({
        data: {
          nombre: data.nombre,
          correo_electronico: data.correo_electronico,
          edad: data.edad,
          fecha_nacimiento: fecha_nacimiento,
          codigo_verificacion: codigo.toString(),
        },
      });
    } catch (error) {
      this.validarErrores(error);
    }

    await this.notificacionesService.enviarCorreo(
      data,
      params,
      'Código de verificación',
      1,
    );
    return persona;
  }

  async validarCodigoVerificacion(data: ValidateCodigoDto) {
    let persona = await this.prismaService.personas.findFirst({
      where: { persona_id: data.persona_id, codigo_verificacion: data.codigo },
    });

    if (persona == null || persona == undefined) {
      throw new InternalServerErrorException(
        `El código de verificación es incorrecto. Inténtelo de nuevo`,
      );
    }

    if (persona.verificado == true) {
      return this.prismaService.personas.findUnique({
        where: { persona_id: persona.persona_id },
      });
    }

    let personaUpdate = await this.prismaService.personas.update({
      where: { persona_id: persona.persona_id },
      data: { verificado: true },
    });

    await this.notificacionesService.enviarCorreo(
      personaUpdate,
      personaUpdate,
      'Verificado correctamente',
      2,
    );

    return personaUpdate;
  }

  async calcularAnioNacimiento(edad: number, mes: number, dia: number) {
    let anio = new Date().getFullYear() - edad;

    if (mes > new Date().getMonth() + 1) {
      anio--;
    } else if (mes == new Date().getMonth() + 1 && dia > new Date().getDate()) {
      anio--;
    }
    return anio;
  }

  generarCodigoAleatorio(max: number, min: number): Number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  validarErrores(error: any) {
    if (error.code == 'P2002') {
      throw new InternalServerErrorException(
        `El ${error.meta.target[0]} ya se encuentra registrado.`,
      );
    }
    if (error.code == 'P2009') {
      throw new InternalServerErrorException(
        `Verifique que el mes y el día de nacimiento sean correctos`,
      );
    }
  }
}
