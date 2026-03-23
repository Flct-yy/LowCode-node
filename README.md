# API 服务

这是一个基于 NestJS 框架开发的 API 服务，为低代码平台提供后端支持。

## 项目结构

```
├── src/             # 源代码目录
│   ├── app.module.ts    # 应用根模块
│   ├── app.controller.ts # 应用控制器
│   ├── app.service.ts    # 应用服务
│   ├── main.ts           # 应用入口
│   ├── database/         # 数据库模块
│   │   ├── database.module.ts
│   │   └── index.ts
│   └── page/             # 页面模块
│       ├── page.controller.ts
│       ├── page.module.ts
│       └── page.service.ts
├── dist/            # 编译输出目录
├── package.json     # 项目配置和依赖
├── tsconfig.json    # TypeScript 配置
├── nest-cli.json    # NestJS CLI 配置
├── .env.example     # 环境变量示例
└── README.md        # 项目说明文档
```

## 技术栈

- **框架**: NestJS 11
- **语言**: TypeScript
- **数据库**: Supabase
- **依赖管理**: Yarn

## 快速开始

### 环境要求

- Node.js 18+
- Yarn 4+

### 安装依赖

```bash
yarn install
```

### 配置环境变量

复制 `.env.example` 文件为 `.env` 并填写相应的环境变量：

```bash
cp .env.example .env
```

### 运行项目

#### 开发模式

```bash
yarn start:dev
```

#### 生产模式

```bash
yarn build
yarn start:prod
```

## API 接口

### 基础信息

- **服务地址**: http://localhost:3001
- **CORS**: 已启用

### 主要接口

#### 页面相关接口

- `GET /page` - 获取页面列表
- `GET /page/:id` - 获取单个页面详情
- `POST /page` - 创建新页面
- `PUT /page/:id` - 更新页面
- `DELETE /page/:id` - 删除页面

## 项目配置

### 环境变量

| 变量名 | 描述 | 示例值 |
|-------|------|--------|
| DB_HOST | 数据库主机 | localhost |
| DB_PORT | 数据库端口 | 5432 |
| DB_USERNAME | 数据库用户名 | postgres |
| DB_PASSWORD | 数据库密码 | password |
| DB_DATABASE | 数据库名称 | lowcode |

## 部署说明

1. 构建项目：`yarn build`
2. 启动服务：`yarn start:prod`
3. 服务将运行在 3001 端口

## 开发指南

### 添加新模块

1. 使用 NestJS CLI 创建新模块：
   ```bash
   nest generate module module-name
   ```

2. 创建对应的控制器和服务：
   ```bash
   nest generate controller module-name
   nest generate service module-name
   ```

### 代码风格

项目使用 TypeScript 标准代码风格，遵循 NestJS 最佳实践。

## 许可证

MIT License
