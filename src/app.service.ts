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
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    console.log('🚀 جاري فحص وتجهيز البيانات الأساسية...');

    try {
      // 1. إضافة يوزر أساسي (ID: 1)
      await this.dataSource.query(`
        INSERT INTO "user" ("id", "username", "password", "role") 
        VALUES (1, 'yazan', '123456', 'admin')
        ON CONFLICT (id) DO NOTHING;
      `);

      // 2. إضافة حاجز أساسي (ID: 1)
      await this.dataSource.query(`
        INSERT INTO "checkpoint" ("id", "name", "location", "status") 
        VALUES (1, 'حاجز قلنديا', 'القدس', 'Open')
        ON CONFLICT (id) DO NOTHING;
      `);

      console.log('✅ تم تجهيز اليوزر والحاجز رقم 1 بنجاح!');
    } catch (error) {
      console.error('❌ خطأ في زرع البيانات:');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
