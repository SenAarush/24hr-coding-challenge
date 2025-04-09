import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ApiResponse } from 'types';
import { AuthService } from './auth.service';

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

  @Post('signout')
  logout(): ApiResponse<object> {
    return {
      message: 'Logout successful',
      statusCode: 200,
      data: {},
    };
  }
}
