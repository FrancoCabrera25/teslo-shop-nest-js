import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../../interface/validate-roles';

export const META_ROLES = 'roles';

export const RolesProtected = (...args: ValidRoles[]) =>
  SetMetadata(META_ROLES, args);
