import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<unknown> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash: _password_hash, ...result } = user;
      void _password_hash;
      return result;
    }
    return null;
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.validateUser(username, pass);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const authUser = user as { id: number; username: string; role: string };
    const payload = {
      sub: authUser.id,
      username: authUser.username,
      role: authUser.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
