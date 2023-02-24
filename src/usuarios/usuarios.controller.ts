import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, SignInUsuarioDto } from './dto/usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('signin')
  iniciarSesion(@Body('data') data: SignInUsuarioDto) {
    console.log('data', data);
    return this.usuariosService.iniciarSesion(data);
  }

  @Post('create')
  crearUsuario(@Body('data') data: CreateUsuarioDto) {
    return this.usuariosService.crearUsuario(data);
  }
}
