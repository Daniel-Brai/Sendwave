import { Request } from 'express';

export function IsAuthenticated(request: Request): boolean {
  return request.isAuthenticated();
}
