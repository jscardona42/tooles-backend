import { Injectable, InternalServerErrorException } from '@nestjs/common';
const SibApiV3Sdk = require('sib-api-v3-typescript');

@Injectable()
export class NotificacionesService {
  async enviarCorreo(
    data: any,
    params: any,
    sender_name: string,
    plantilla_id: number,
  ) {
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.SENDINBLUE_KEY;

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.templateId = plantilla_id;
    sendSmtpEmail.sender = {
      name: sender_name,
      email: 'jscardona42@gmail.com',
    };

    sendSmtpEmail.to = [{ email: data.correo_electronico, name: data.nombre }];
    sendSmtpEmail.params = params;

    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.log(JSON.stringify(error));
      throw new InternalServerErrorException('Ocurrió un error',JSON.stringify(error));
    }
  }
}
