-- =============================================
-- 低代码平台页面初始化脚本（page_model主表 + page_metadata从表）
-- 适配指定表结构：先建表→建序列→绑定默认值→插入数据
-- =============================================
-- 事务包裹：所有操作原子性执行
BEGIN;

-- =============================================
-- 1. 清理原有表和序列（开发环境使用，生产环境注释）
-- =============================================
DROP TABLE IF EXISTS public.page_metadata CASCADE;
DROP TABLE IF EXISTS public.page_model CASCADE;
DROP SEQUENCE IF EXISTS public.page_model_id_seq;
DROP SEQUENCE IF EXISTS public.page_metadata_id_seq;

-- =============================================
-- 2. 创建page_model主表（按指定结构）
-- =============================================
-- 第一步：先创建表（不指定序列默认值）
CREATE TABLE public.page_model (
    id bigint NOT NULL, -- 先只定义主键字段，不设置默认值
    com_tree json NOT NULL,  -- 组件树JSON数据
    aspect_ratio varchar(20) NOT NULL DEFAULT '16/9', -- 宽高比例（字符串类型，长度限制20足够）
    com_count integer NOT NULL DEFAULT 1, -- 数量
    CONSTRAINT page_model_pkey PRIMARY KEY (id)
);

-- 第二步：创建序列并绑定到主表主键列
CREATE SEQUENCE public.page_model_id_seq 
    START WITH 1 
    INCREMENT BY 1
    OWNED BY public.page_model.id; -- 表已存在，可正常绑定

-- 第三步：给表的id字段设置默认值（关联序列，实现自增）
ALTER TABLE public.page_model 
ALTER COLUMN id SET DEFAULT nextval('public.page_model_id_seq'::regclass);

-- =============================================
-- 3. 创建page_metadata从表（按指定结构）
-- =============================================
-- 第一步：创建从表（不设置序列默认值）
CREATE TABLE public.page_metadata (
    id bigint NOT NULL, -- 先不设置默认值
    model_id bigint NOT NULL,  -- 关联主表page_model的主键id
    title character varying(255) NOT NULL,  -- 页面标题
    description text NOT NULL,  -- 页面描述
    keywords text[] NOT NULL DEFAULT '{}',  -- 关键词数组
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 更新时间
    -- 主键约束
    CONSTRAINT page_metadata_pkey PRIMARY KEY (id),
    -- 外键约束：关联主表page_model的主键id
    CONSTRAINT fk_page_metadata_page_model FOREIGN KEY (model_id)
        REFERENCES public.page_model (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    -- 标题唯一约束
    CONSTRAINT uk_page_metadata_title UNIQUE (title),
    -- 一对一关联约束
    CONSTRAINT uk_page_metadata_model_id UNIQUE (model_id)
);

-- 第二步：创建序列并绑定到从表主键列
CREATE SEQUENCE public.page_metadata_id_seq 
    START WITH 1 
    INCREMENT BY 1
    OWNED BY public.page_metadata.id;

-- 第三步：给从表的id字段设置默认值（补全原代码缺失步骤）
ALTER TABLE public.page_metadata 
ALTER COLUMN id SET DEFAULT nextval('public.page_metadata_id_seq'::regclass);

COMMIT;