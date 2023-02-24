import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, SignInUsuarioDto } from './dto/usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('signin')
  async iniciarSesion(@Body() data: SignInUsuarioDto) {
    return this.usuariosService.iniciarSesion(data);
  }

  @Post('create')
  async crearUsuario(@Body() data: CreateUsuarioDto) {
    return this.usuariosService.crearUsuario(data);
  }
}
