// src/types/config.ts
/**
 * CLI 工具的配置接口
 */
export interface DappConfig {
  /** 生成的接口文件输出目录 */
  outputDir: string;
  /** API 请求的基础 URL（可选） */
  apiPrefix?: string;
}

/**
 * API 认证配置接口
 */
export interface AuthConfig {
  /** 认证类型：无认证、Bearer Token、Basic Auth 或自定义头部 */
  type: 'none' | 'bearer' | 'basic' | 'custom';
  /** Bearer Token */
  token?: string;
  /** Basic Auth 用户名 */
  username?: string;
  /** Basic Auth 密码 */
  password?: string;
  /** 自定义认证头部名称 */
  headerName?: string;
  /** 自定义认证头部值 */
  headerValue?: string;
}

/**
 * API 请求配置接口
 */
export interface RequestConfig {
  /** API 请求地址 */
  url: string;
  /** HTTP 请求方法 */
  method: string;
  /** 认证配置 */
  auth: AuthConfig;
  /** 请求体数据（可选） */
  data?: any;
}