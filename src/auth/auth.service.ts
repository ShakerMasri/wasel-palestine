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

  async signIn(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      access_token: this.jwtService.sign({ username }),
    };
  }
}
