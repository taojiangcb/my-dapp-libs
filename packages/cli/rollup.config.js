const resolve = require('@rollup/plugin-node-resolve'); // 解析 node_modules 中的模块
const commonjs = require('@rollup/plugin-commonjs');    // 将 CommonJS 模块转换为 ES6
const typescript = require('@rollup/plugin-typescript'); // 支持 TypeScript 编译
const terser = require('@rollup/plugin-terser');         // 压缩输出文件

module.exports = {
  // 指定打包的入口文件
  input: 'src/index.ts',
  output: [
    {
      // 输出目录为 dist
      dir: 'dist',
      // 输出格式为 CommonJS
      format: 'cjs',
      // 生成 sourcemap 文件，便于调试
      sourcemap: true,
      // 保持模块结构，即每个模块都会生成单独的文件
      preserveModules: true,
      // 自动导出模块
      exports: 'auto'
    }
  ],
  plugins: [
    // 使用 @rollup/plugin-node-resolve 插件，处理第三方模块的解析
    resolve({
      // 优先使用 Node 内置模块
      preferBuiltins: true
    }),
    // 使用 @rollup/plugin-commonjs 插件，转换 CommonJS 模块为 ES6 形式
    commonjs(),
    // 使用 @rollup/plugin-typescript 插件，编译 TypeScript 文件
    typescript({
      // 指定 TypeScript 配置文件为 ./tsconfig.json
      tsconfig: './tsconfig.json'
    }),
    // 使用 @rollup/plugin-terser 插件，压缩输出文件
    terser()
  ],
  // 指定外部依赖，不将这些依赖打包到输出文件中
  external: [
    'commander',
    'inquirer',
    'axios',
    'quicktype-core',
    'fs',
    'path',
    'fs/promises'
  ]
};