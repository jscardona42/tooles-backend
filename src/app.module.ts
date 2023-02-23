import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'prisma.service';
import { NotificacionesController } from './notificaciones/notificaciones.controller';
import { NotificacionesService } from './notificaciones/notificaciones.service';
import { PersonasController } from './personas/personas.controller';
import { PersonasService } from './personas/personas.service';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRESIN,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [
    PersonasController,
    NotificacionesController,
    UsuariosController,
  ],
  providers: [
    PrismaService,
    PersonasService,
    NotificacionesService,
    UsuariosService,
  ],
})
export class AppModule {}
