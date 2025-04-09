import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { ApiResponse, TokenPayload } from 'types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<ApiResponse<object>> {
    this.logger.log('Signup attempt started for email: ' + dto.email);
    const { name, email, password, role = 'user' } = dto;

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      this.logger.warn('Signup failed: Email already in use: ' + email);
      throw new BadRequestException('Email already in use');
    }

    const hPass = await bcrypt.hash(password, 10);
    await this.userModel.create({
      name,
      email,
      password: hPass,
      role,
    });

    this.logger.log('User signed up successfully with email: ' + email);

    return {
      statusCode: 201,
      message: 'User registered successfully',
      data: {},
    };
  }

  async signin(dto: SigninDto): Promise<ApiResponse<object>> {
    this.logger.log('Signin attempt started for email: ' + dto.email);
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      this.logger.warn(
        'Signin failed: Invalid credentials for email: ' + dto.email,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      this.logger.warn(
        'Signin failed: Invalid credentials for email: ' + dto.email,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET') || '';
    if (jwtSecret === '') {
      this.logger.error('JWT_SECRET is not defined');
      throw new Error('JWT_SECRET is not defined');
    }

    const token = this.signToken(
      { email: user.email, role: user.role },
      jwtSecret,
    );

    this.logger.log('User signed in successfully with email: ' + dto.email);

    return {
      statusCode: 200,
      message: 'Login successful',
      data: {
        token,
        iat: Date.now(),
        exp: Date.now() + 3600 * 1000,
      },
    };
  }

  private signToken(payload: TokenPayload, key: string): string {
    this.logger.log('Signing token for payload: ' + JSON.stringify(payload));
    const token = this.jwtService.sign(payload, {
      secret: key,
      expiresIn: '1h',
    });
    this.logger.debug('Token signed successfully: ' + token);
    return token;
  }
}
