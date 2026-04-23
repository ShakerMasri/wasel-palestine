import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private dataSource: DataSource) { }

  async onModuleInit() {
    console.log('جاري فحص وإدخال البيانات الأساسية...');

    try {
      // 1. إضافة مستخدم افتراضي (ID: 1)
      await this.dataSource.query(`
        INSERT INTO "user" ("id", "username", "password", "role") 
        VALUES (1, 'yazan', '123456', 'admin')
        ON CONFLICT (id) DO NOTHING;
      `);

      // 2. إضافة حاجز افتراضي (ID: 1)
      await this.dataSource.query(`
        INSERT INTO "checkpoint" ("id", "name", "location", "status") 
        VALUES (1, 'حاجز شافي شمرون', 'نابلس', 'Open')
        ON CONFLICT (id) DO NOTHING;
      `);

      console.log('✅ تم فحص وإدخال البيانات الأساسية بنجاح!');
    } catch (error) {
      console.error('❌ حدث خطأ أثناء إدخال البيانات:', error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}