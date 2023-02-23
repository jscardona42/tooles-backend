import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization != undefined) {
      try {
        let authorization = request.headers.authorization;
        jwt.verify(authorization, process.env.JWT_SECRET);
        return true;
      } catch (error) {
        throw new UnauthorizedException(`Usuario no autorizado`);
      }
    }

    throw new UnauthorizedException(`No autorizado`);
  }
}
