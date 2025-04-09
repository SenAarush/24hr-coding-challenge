import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { email: string; role: string };
}

@Injectable()
export class adminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Admin access only');
    }

    return true;
  }
}
