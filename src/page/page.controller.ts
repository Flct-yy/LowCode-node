import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PageService } from './page.service';

/**
 * 页面控制器
 * 处理与页面相关的HTTP请求
 */
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) { }

  /**
   * 创建新页面
   * @param createPageDto 创建页面的数据
   * @returns 创建的页面信息
   */
  @Post()
  createPage(@Body() createPageDto: any) {
    return this.pageService.createPage(createPageDto);
  }

  /**
   * 获取所有页面
   * @returns 所有页面的列表
   */
  @Get()
  getAllPages() {
    return this.pageService.getAllPages();
  }

  /**
   * 根据ID获取页面
   * @param id 页面ID
   * @returns 页面信息
   */
  @Get(':id')
  getPageById(@Param('id') id: string) {
    return this.pageService.getPageById(BigInt(id));
  }
  
  /**
 * 根据ID获取组件树
 * @param id 页面ID
 * @returns 组件树
 */
  @Get(':id/com_tree')
  getComTreeById(@Param('id') id: string) {
    return this.pageService.getComTreeById(BigInt(id));
  }

  /**
   * 更新页面
   * @param id 页面ID
   * @param updatePageDto 更新页面的数据
   * @returns 更新后的页面信息
   */
  @Put(':id')
  updatePage(@Param('id') id: string, @Body() updatePageDto: any) {
    return this.pageService.updatePage(BigInt(id), updatePageDto);
  }

  /**
   * 删除页面
   * @param id 页面ID
   */
  @Delete(':id')
  deletePage(@Param('id') id: string) {
    return this.pageService.deletePage(BigInt(id));
  }
}