export class Persona {
  persona_id: number;
  nombre: string;
  correo_electronico: string;
  edad: number;
  fecha_nacimiento: Date;
  verificado?: boolean;
  codigo_verificacion?: string;
}
