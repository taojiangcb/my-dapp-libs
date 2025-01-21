// src/utils/auth.ts
import axios from 'axios';
import { AuthConfig, RequestConfig } from '../types/config';

/**
 * 根据认证配置生成请求头
 * @param auth - 认证配置对象
 * @returns 请求头对象
 */
export function generateAuthHeaders(auth: AuthConfig): Record<string, string> {
  switch (auth.type) {
    case 'none':
      return {};
      
    case 'bearer':
      if (!auth.token) {
        throw new Error('Bearer token is required');
      }
      return {
        Authorization: `Bearer ${auth.token}`
      };

    case 'basic':
      if (!auth.username || !auth.password) {
        throw new Error('Username and password are required for basic auth');
      }
      const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
      return {
        Authorization: `Basic ${credentials}`
      };

    case 'custom':
      if (!auth.headerName || !auth.headerValue) {
        throw new Error('Header name and value are required for custom auth');
      }
      return {
        [auth.headerName]: auth.headerValue
      };

    default:
      return {};
  }
}

/**
 * 发送带认证的 HTTP 请求
 * @param config - 请求配置对象
 * @returns axios 响应对象
 */
export async function makeAuthenticatedRequest(config: RequestConfig) {
  // 生成认证头
  const headers = generateAuthHeaders(config.auth);
  
  try {
    // 发送请求
    const response = await axios({
      url: config.url,
      method: config.method,
      headers,
      data: config.data
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request failed: ${error.message}`);
    }
    throw error;
  }
}