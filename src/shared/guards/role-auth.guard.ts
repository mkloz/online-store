import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthGuard } from '../guards';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayloadValidator } from '../validators/jwt-payload.validator';
import { Role } from '@prisma/client';
import { ApiConfigService } from '@config/api-config.service';

@Injectable()
export class RoleAuthGuard extends AuthGuard {
  constructor(
    private readonly reflector: Reflector,
    jwtServ: JwtService,
    cs: ApiConfigService,
  ) {
    super(jwtServ, cs);
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const res = await super.canActivate(ctx);
    if (!res) return false;

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!roles?.length) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    if (!('user' in req)) return false;
    if (
      JwtPayloadValidator.validate(req.user) &&
      roles.includes(req.user?.role)
    ) {
      return true;
    }

    return false;
  }
}
