import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class jwtGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'];
    // console.log(authHeader);

    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization format');
    }

    const token = authHeader.split(' ')[1];
    // console.log(token);

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      console.log(jwtSecret);
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }
      const decoded = jwt.verify(token, jwtSecret) as {
        email: string;
        role: string;
      };
      // console.log(decoded);

      request['user'] = {
        email: decoded.email,
        role: decoded.role,
      };

      return true;
    } catch (err) {
      if (err instanceof Error)
        throw new UnauthorizedException('Invalid or expired token');
    }
    return false;
  }
}
