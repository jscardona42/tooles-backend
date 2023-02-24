import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma.service';
import { CreateUsuarioDto, SignInUsuarioDto } from './dto/usuario.dto';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async crearUsuario(data: CreateUsuarioDto) {
    let llave = await bcrypt.genSalt();
    let contrasena = await bcrypt.hash(data.contrasena, llave);

    try {
      return await this.prismaService.usuarios.create({
        data: {
          nombre_usuario: data.nombre_usuario,
          contrasena: contrasena,
          salt: llave,
        },
        select: { nombre_usuario: true, usuario_id: true },
      });
    } catch (error) {
      this.validarErrores(error);
    }
  }

  async iniciarSesion(data: SignInUsuarioDto) {
    console.log("data",data);
    let usuario = await this.prismaService.usuarios.findFirst({
      where: { nombre_usuario: data.nombre_usuario },
    });

    if (usuario == null) {
      throw new UnauthorizedException(`Credenciales inválidas`);
    }

    let usuario2 = await this.prismaService.usuarios.findFirst({
      where: {
        nombre_usuario: data.nombre_usuario,
        contrasena: await bcrypt.hash(data.contrasena, usuario.salt),
      },
    });

    if (usuario2 == null) {
      throw new UnauthorizedException(`Credenciales inválidas`);
    }

    const token = this.jwtService.sign(
      { usuario_id: usuario2.usuario_id }
    );
    return this.guardarToken(token, usuario2);
  }

  async guardarToken(token: any, usuario: Usuario) {
    return this.prismaService.usuarios.update({
      where: { usuario_id: usuario.usuario_id },
      data: { token: token },
      select: { nombre_usuario: true, usuario_id: true, token: true },
    });
  }

  validarErrores(error: any) {
    if (error.code == 'P2002') {
      throw new InternalServerErrorException(
        `El ${error.meta.target[0]} ya se encuentra registrado.`,
      );
    }
  }
}
