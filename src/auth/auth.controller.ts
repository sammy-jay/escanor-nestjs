import { Controller } from '@nestjs/common';
import {
  Body,
  HttpCode,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dtos/registration-data.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() registrationDto: RegistrationDto) {
    return this.authService.register(registrationDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestUser, @Res() res: Response) {
    const { user } = req;
    const access_token = await this.authService.getCookieWithJwtToken(user.id);
    const refresh_token = await this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );

    // res.setHeader('Set-Cookie', [cookie, cookie2]);
    // return res.send(user);
    await this.usersService.setCurrentRefreshToken(refresh_token, user.id);
    
    return res.send({
      access_token,
      refresh_token,
      user: { ...user },
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestUser, @Res() res: Response) {
    return res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
