import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        address: {
          select: {
            city: true,
            country: true,
          },
        },
        posts: true,
      },
    });
    if (user) return user;

    throw new NotFoundException('Invalid credentials');
  }

  async getById(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (user) {
      delete user.password;
      return user;
    }

    throw new NotFoundException('Invalid credentials');
  }

  async createUser(userData: CreateUserDto) {
    const newUser = await this.prismaService.user.create({
      data: userData,
    });

    return newUser;
  }

  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.user.update({
      where: { id },
      data: {
        currentHashedRefreshToken: hashedToken,
      },
    });
  }
}
