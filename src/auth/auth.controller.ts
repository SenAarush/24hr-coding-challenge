import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ApiResponse } from 'types';
import { AuthService } from './auth.service';
import { jwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<ApiResponse<object>> {
    return this.authService.signup(dto);
  }

  @Post('signin')
  async signin(@Body() dto: SigninDto): Promise<ApiResponse<object>> {
    return this.authService.signin(dto);
  }

  @UseGuards(jwtGuard)
  @Post('signout')
  logout(): ApiResponse<object> {
    return {
      message: 'Logout successful',
      statusCode: 200,
      data: {},
    };
  }
}
