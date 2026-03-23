import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * 应用程序控制器
 * 处理根路径请求
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 处理GET请求，返回欢迎消息
   * @returns 欢迎消息字符串
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}