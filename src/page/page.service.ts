import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * 创建页面的DTO接口
 */
interface CreatePageDto {
  /**
   * 页面标题
   */
  title: string;
  /**
   * 页面描述
   */
  description?: string;
  /**
   * 页面关键词数组
   */
  keywords?: string[];
  /**
   * 组件树结构
   */
  comTree: any;
  /**
   * 宽高比
   */
  aspectRatio?: string;
  /**
   * 组件数量
   */
  comCount?: number;
}

/**
   * 更新页面的DTO接口
   */
interface UpdatePageDto {
  /**
   * 页面标题
   */
  title?: string;
  /**
   * 页面描述
   */
  description?: string;
  /**
   * 页面关键词数组
   */
  keywords?: string[];
  /**
   * 组件数量
   */
  comCount?: number;
  /**
   * 组件树结构
   */
  comTree?: any;
  /**
   * 宽高比
   */
  aspectRatio?: string;
}

/**
 * 页面服务
 * 提供页面相关的业务逻辑
 */
@Injectable()
export class PageService {
  constructor(
    /**
     * 注入Supabase客户端
     */
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient
  ) { }

  /**
   * 创建新页面
   * @param createPageDto 创建页面的数据
   * @returns 创建的页面信息
   */
  async createPage(createPageDto: CreatePageDto): Promise<void> {
    try {
      console.log('Creating page with data:', createPageDto);
      
      // 先创建页面模型
      const { data: pageModel, error: modelError } = await this.supabase
        .from('page_model')
        .insert({
          com_tree: createPageDto.comTree,
          aspect_ratio: createPageDto.aspectRatio || '16/9',
          com_count: createPageDto.comCount || 0,
        })
        .select('id')
        .single();

      console.log('Page model creation result:', { data: pageModel, error: modelError });
      
      if (modelError) {
        console.error('Model error details:', modelError);
        throw new InternalServerErrorException(`Failed to create page model: ${modelError.message}`);
      }

      // 创建页面元信息，使用pageModel的ID作为model_id
      const { data: pageMetadata, error: metadataError } = await this.supabase
        .from('page_metadata')
        .insert({
          title: createPageDto.title,
          description: createPageDto.description || '',
          keywords: createPageDto.keywords || [],
          model_id: pageModel.id,
        })
        .select('id')
        .single();

      console.log('Page metadata creation result:', { data: pageMetadata, error: metadataError });
      
      if (metadataError) {
        console.error('Metadata error details:', metadataError);
        throw new InternalServerErrorException(`Failed to create page metadata: ${metadataError.message}`);
      }
    } catch (error) {
      console.error('Create page error:', error);
      if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Failed to create page: ${(error as Error).message}`);
      }
    }
  }

  /**
   * 根据ID获取页面
   * @param id 页面ID
   * @returns 页面信息
   */
  async getPageById(id: bigint): Promise<any> {
    // 先获取页面元信息
    const { data: metadata, error: metadataError } = await this.supabase
      .from('page_metadata')
      .select('id, title, description, keywords, created_at, updated_at, model_id')
      .eq('id', id)
      .single();

    if (metadataError || !metadata) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }

    // 然后根据model_id获取页面模型
    const { data: model, error: modelError } = await this.supabase
      .from('page_model')
      .select('com_tree, aspect_ratio, com_count')
      .eq('id', metadata.model_id)
      .single();

    if (modelError || !model) {
      throw new InternalServerErrorException('Failed to get page model');
    }

    // 返回用户指定的数据结构，过滤掉不需要的字段
    return {
      pageMetadata: {
        id: metadata.id,
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        createdAt: metadata.created_at,
        updatedAt: metadata.updated_at
      },
      com_tree: model.com_tree,
      aspect_ratio: model.aspect_ratio,
      com_count: model.com_count,
    };
  }

  /**
   * 根据ID获取组件树和缩放比例
   * @param id 页面ID
   * @returns 组件树
   */
  async getComTreeById(id: bigint): Promise<any> {
    // 先获取页面元信息
    const { data: metadata, error: metadataError } = await this.supabase
      .from('page_metadata')
      .select('model_id')
      .eq('id', id)
      .single();

    if (metadataError || !metadata) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }

    // 然后根据model_id获取页面模型
    const { data: model, error: modelError } = await this.supabase
      .from('page_model')
      .select('com_tree, aspect_ratio')
      .eq('id', metadata.model_id)
      .single();

    if (modelError || !model) {
      throw new InternalServerErrorException('Failed to get page model');
    }

    // 返回用户指定的数据结构
    return {
      com_tree: model.com_tree,
      aspect_ratio: model.aspect_ratio,
    };
  }

  /**
   * 获取所有页面
   * @returns 所有页面的列表
   */
  async getAllPages(): Promise<any[]> {
    // 获取所有页面元信息
    const { data: metadataList, error: metadataError } = await this.supabase
      .from('page_metadata')
      .select('id, title, description, keywords, created_at, updated_at, model_id');

    if (metadataError) {
      throw new InternalServerErrorException('Failed to get pages');
    }

    // 转换为包含com_count的格式，过滤掉不需要的字段
    const pages = await Promise.all((metadataList || []).map(async (metadata) => {
      // 根据model_id获取页面模型
      const { data: model } = await this.supabase
        .from('page_model')
        .select('com_count')
        .eq('id', metadata.model_id)
        .single();

      return {
        id: metadata.id,
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        createdAt: metadata.created_at,
        updatedAt: metadata.updated_at,
        com_count: model?.com_count
      };
    }));

    return pages;
  }

  /**
   * 更新页面
   * @param id 页面ID
   * @param updatePageDto 更新页面的数据
   * @returns 更新后的页面信息
   */
  async updatePage(id: bigint, updatePageDto: UpdatePageDto): Promise<any> {
    try {
      console.log('Updating page with id:', id, 'and data:', updatePageDto);
      
      // 先获取页面元信息，获取model_id
      const { data: metadata, error: metadataError } = await this.supabase
        .from('page_metadata')
        .select('model_id')
        .eq('id', id)
        .single();

      console.log('Page metadata retrieval result:', { data: metadata, error: metadataError });
      
      if (metadataError || !metadata) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }

      // 更新页面元信息
      const updateData: any = {};
      if (updatePageDto.title !== undefined) updateData.title = updatePageDto.title;
      if (updatePageDto.description !== undefined) updateData.description = updatePageDto.description;
      if (updatePageDto.keywords !== undefined) updateData.keywords = updatePageDto.keywords;

      if (Object.keys(updateData).length > 0) {
        const { error: updateMetadataError } = await this.supabase
          .from('page_metadata')
          .update(updateData)
          .eq('id', id);

        console.log('Page metadata update result:', { error: updateMetadataError });
        
        if (updateMetadataError) {
          console.error('Metadata update error details:', updateMetadataError);
          throw new InternalServerErrorException(`Failed to update page metadata: ${updateMetadataError.message}`);
        }
      }

      // 准备页面模型更新数据
      const modelUpdateData: any = {};
      if (updatePageDto.comTree !== undefined) modelUpdateData.com_tree = updatePageDto.comTree;
      if (updatePageDto.aspectRatio !== undefined) modelUpdateData.aspect_ratio = updatePageDto.aspectRatio;
      if (updatePageDto.comCount !== undefined) modelUpdateData.com_count = updatePageDto.comCount;

      if (Object.keys(modelUpdateData).length > 0) {
        const { error: modelError } = await this.supabase
          .from('page_model')
          .update(modelUpdateData)
          .eq('id', metadata.model_id);

        console.log('Page model update result:', { error: modelError });
        
        if (modelError) {
          console.error('Model update error details:', modelError);
          throw new InternalServerErrorException(`Failed to update page model: ${modelError.message}`);
        }
      }

      // 返回更新后的页面信息
      return this.getPageById(id);
    } catch (error) {
      console.error('Update page error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Failed to update page: ${(error as Error).message}`);
      }
    }
  }

  /**
   * 删除页面
   * @param id 页面元信息ID
   */
  async deletePage(id: bigint): Promise<void> {
    try {
      console.log('Deleting page with id:', id);
      
      // 先获取页面元信息，获取model_id
      const { data: pageMetadata, error: metadataError } = await this.supabase
        .from('page_metadata')
        .select('model_id')
        .eq('id', id)
        .single();

      console.log('Page metadata retrieval result:', { data: pageMetadata, error: metadataError });
      
      if (metadataError || !pageMetadata) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }

      // 删除页面模型
      const { error: modelError } = await this.supabase
        .from('page_model')
        .delete()
        .eq('id', pageMetadata.model_id);

      console.log('Page model deletion result:', { error: modelError });
      
      if (modelError) {
        console.error('Model deletion error details:', modelError);
        throw new InternalServerErrorException(`Failed to delete page model: ${modelError.message}`);
      }

      // 删除页面元信息
      const { error: deleteMetadataError } = await this.supabase
        .from('page_metadata')
        .delete()
        .eq('id', id);

      console.log('Page metadata deletion result:', { error: deleteMetadataError });
      
      if (deleteMetadataError) {
        console.error('Metadata deletion error details:', deleteMetadataError);
        throw new InternalServerErrorException(`Failed to delete page metadata: ${deleteMetadataError.message}`);
      }

    } catch (error) {
      console.error('Delete page error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Failed to delete page: ${(error as Error).message}`);
      }
    }
  }
}
