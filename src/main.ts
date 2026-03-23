import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * 应用程序入口函数
 * 创建NestJS应用实例并启动服务器
 */
async function bootstrap() {
  console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_DATABASE);

  // 创建NestJS应用实例
  const app = await NestFactory.create(AppModule);
  // 启用CORS支持
  app.enableCors();
  // 启动服务器，使用环境变量中的端口或默认端口3001
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  // 输出服务器运行信息
  console.log(`已经运行在 http://localhost:${PORT}`);
}

// 调用入口函数启动应用
bootstrap();