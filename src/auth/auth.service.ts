/*
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<unknown> {
    const user = await this.usersService.findOne(username);
    console.log('User found from DB:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const valid = await bcrypt.compare(pass, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException('Invalid password');
    }
    const { password_hash: _password_hash, ...result } = user;
    void _password_hash;
    return result;
  }
<<<<<<< HEAD
  async signIn(username: string, pass: string): Promise<any> {
    const payload = { sub: 1, username: 'yazan' };
    return {
      access_token: await this.jwtService.signAsync(payload),
=======

  async signIn(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const u: any = user;
    const payload = { username: u.username, sub: u.id };
    return {
      access_token: this.jwtService.sign(payload),
>>>>>>> 2f4a113fd05e464bcbea4d4cd0e6f6d037968205
    };
  }
}
*/
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<unknown> {
    const user = await this.usersService.findOne(username);
    console.log('User found from DB:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const valid = await bcrypt.compare(pass, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException('Invalid password');
    }
    // هون بنشيل الباسورد من النتيجة اللي بترجع
    const { password_hash, ...result } = user;
    return result;
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.validateUser(username, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    const u: any = user;
    // هون بنستخدم البيانات الحقيقية لليوزر (الاسم والـ ID)
    const payload = { username: u.username, sub: u.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}