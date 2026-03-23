import { Injectable } from '@nestjs/common';

/**
 * 应用程序服务
 * 提供应用程序的核心业务逻辑
 */
@Injectable()
export class AppService {
  /**
   * 获取欢迎消息
   * @returns 欢迎消息字符串
   */
  getHello(): string {
    return 'Hello World from @wect/api!';
  }
}