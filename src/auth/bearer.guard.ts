import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BearerGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;

        if (!authorizationHeader) {
            return false;
        }

        const [bearer, token] = authorizationHeader.split(' ');

        if (bearer.toLowerCase() !== 'bearer' || !token) {
            return false;
        }

        request.token = token;
        return true;
    }
}
