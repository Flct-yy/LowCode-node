import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PageModule } from './page/page.module';
import { DatabaseModule } from './database/database.module';

/**
 * 应用程序根模块
 * 导入并配置所有依赖模块
 */
@Module({
  imports: [
    // 配置模块，用于加载环境变量
    ConfigModule.forRoot(),
    // 数据库模块
    DatabaseModule,
    // 页面模块
    PageModule,
  ],
  controllers: [AppController], // 应用控制器
  providers: [AppService], // 应用服务
})
export class AppModule {}

