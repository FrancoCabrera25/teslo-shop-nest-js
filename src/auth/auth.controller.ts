import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RolesProtected } from './decorators/roles-protected/roles-protected.decorator';
import { ValidRoles } from './interface/validate-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  // @SetMetadata('roles', ['admin', 'super-user', 'user'])
  @RolesProtected(ValidRoles.admin, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute(
    @GetUser()
    user: User,
    @GetUser('email') userEmail,
    @RawHeaders() rawHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      userEmail,
      rawHeaders,
    };
  }

  @Get('private2')
  @Auth(ValidRoles.admin, ValidRoles.user)
  testingPrivateRoute2(
    @GetUser()
    user: User,
    @GetUser('email') userEmail,
    @RawHeaders() rawHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      userEmail,
      rawHeaders,
    };
  }
}
