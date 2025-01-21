// src/config/index.ts
import path from 'path';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import { DappConfig } from '../types/config';

/** 默认配置 */
const DEFAULT_CONFIG: DappConfig = {
  outputDir: 'src/interfaces'
};

/**
 * 生成配置文件
 * @param cwd - 当前工作目录
 * @returns 返回生成的配置对象
 */
async function generateConfigFile(cwd: string): Promise<DappConfig> {
  console.log('No .mydapprc.js found, let\'s create one!');
  
  // 通过交互式问答收集配置信息
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'outputDir',
      message: 'Where would you like to save generated interfaces?',
      default: DEFAULT_CONFIG.outputDir,
      validate: (input: string) => {
        return input.trim().length > 0 || 'Output directory is required';
      }
    },
    {
      type: 'input',
      name: 'apiPrefix',
      message: 'Default API prefix (optional):',
      validate: (input: string) => {
        if (!input) return true;
        try {
          new URL(input);
          return true;
        } catch (e) {
          return 'Please enter a valid URL';
        }
      }
    },
    {
      type: 'confirm',
      name: 'createConfig',
      message: 'Would you like to save this configuration?',
      default: true
    }
  ]);

  // 构建配置对象
  const config: DappConfig = {
    outputDir: answers.outputDir,
    ...(answers.apiPrefix && { apiPrefix: answers.apiPrefix })
  };

  // 如果用户选择保存配置，则写入文件
  if (answers.createConfig) {
    const configContent = `module.exports = ${JSON.stringify(config, null, 2)}`;
    const configPath = path.join(cwd, '.mydapprc.js');
    
    try {
      await fs.writeFile(configPath, configContent, 'utf8');
      console.log(`Configuration file created at ${configPath}`);
    } catch (error) {
      console.warn('Failed to create config file:', error.message);
    }
  }

  return config;
}

/**
 * 加载配置文件
 * @param cwd - 当前工作目录
 * @returns 返回配置对象
 */
export async function loadConfig(cwd = process.cwd()): Promise<DappConfig> {
  try {
    const configPath = path.join(cwd, '.mydapprc.js');
    // 检查配置文件是否存在
    const exists = await fs.access(configPath).then(() => true).catch(() => false);
    
    if (!exists) {
      // 如果配置文件不存在，则生成新的配置
      return await generateConfigFile(cwd);
    }

    // 动态导入配置文件
    const userConfig = await import(configPath);
    return {
      ...DEFAULT_CONFIG,
      ...userConfig.default || userConfig
    };
  } catch (error) {
    console.warn('Failed to load config:', error.message);
    return DEFAULT_CONFIG;
  }
}