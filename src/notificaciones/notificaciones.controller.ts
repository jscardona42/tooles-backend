import { Controller } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  // @Post()
  // enviarEmail(@Body() createNotificacioneDto: CreateNotificacioneDto) {
  //   return this.notificacionesService.enviarEmail(createNotificacioneDto);
  // }
}
