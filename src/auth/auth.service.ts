import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { ApiResponse } from 'types';

interface TokenPayload {
  email: string;
  role: 'admin' | 'user';
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<ApiResponse<object>> {
    const { name, email, password, role = 'user' } = dto;

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hPass = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      password: hPass,
      role,
    });

    const token = this.signToken({ email: user.email, role: user.role });

    return {
      statusCode: 201,
      message: 'User registered successfully',
      data: {
        token,
        iat: Date.now(),
        exp: Date.now() + 3600 * 1000,
      },
    };
  }

  async signin(dto: SigninDto): Promise<ApiResponse<object>> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (typeof bcrypt.compare !== 'function') {
      throw new Error('bcrypt.compare is not a function');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken({ email: user.email, role: user.role });

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

  private signToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload);
  }
}
