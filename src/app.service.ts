/*import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
*/

import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private dataSource: DataSource) { }

  async onModuleInit() {
    console.log('­ƒÜÇ Ï¼ÏºÏ¦+è +üÏ¡ÏÁ +êÏ¬Ï¼+ç+èÏ¦ Ïº+äÏ¿+èÏº+åÏºÏ¬ Ïº+äÏúÏ¦ÏºÏ¦+èÏ®...');

    try {
      // 1. ÏÑÏÂÏº+üÏ® +è+êÏ¦Ï¦ ÏúÏ¦ÏºÏ¦+è (ID: 1)
      await this.dataSource.query(`
        INSERT INTO "user" ("id", "username", "password", "role") 
        VALUES (1, 'yazan', '123456', 'admin')
        ON CONFLICT (id) DO NOTHING;
      `);

      // 2. ÏÑÏÂÏº+üÏ® Ï¡ÏºÏ¼Ï¦ ÏúÏ¦ÏºÏ¦+è (ID: 1)
      await this.dataSource.query(`
        INSERT INTO "checkpoint" ("id", "name", "location", "status") 
        VALUES (1, 'Ï¡ÏºÏ¼Ï¦ +é+ä+åÏ»+èÏº', 'Ïº+ä+éÏ»Ï¦', 'Open')
        ON CONFLICT (id) DO NOTHING;
      `);

      console.log('Ô£à Ï¬+à Ï¬Ï¼+ç+èÏ¦ Ïº+ä+è+êÏ¦Ï¦ +êÏº+äÏ¡ÏºÏ¼Ï¦ Ï¦+é+à 1 Ï¿+åÏ¼ÏºÏ¡!');
    } catch (error) {
      console.error('ÔØî Ï«ÏÀÏú +ü+è Ï¦Ï¦Ï¦ Ïº+äÏ¿+èÏº+åÏºÏ¬:');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
