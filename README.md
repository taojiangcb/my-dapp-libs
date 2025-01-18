
# 单仓多包
1. 工作区间的文件相互引入
2. 发包
3. ts 编译到指定的模版
   - lerna + rollup
   
# PNPM 命令
1. 在根目录安装共享的开发依赖：
```bash
pnpm add -D typescript -w   # -w 表示安装在 workspace root
```

1. 在特定的包中安装依赖：
```bash
# 方式1：进入到特定包的目录
cd packages/mydapp-hooks
pnpm add lodash

# 方式2：使用 --filter 在根目录指定包
pnpm add lodash --filter @mydapp/mydapp-hooks
```

3. 安装 workspace 中的其他包（包之间的依赖）：
```bash
pnpm add @mydapp/ui --filter @mydapp/mydapp-hooks --workspace
```

4. 安装所有包的依赖（比如首次 clone 项目后）：
```bash
pnpm install   # 在根目录运行
```

5. 如果要安装特定版本：
```bash
pnpm add lodash@4.17.21 --filter @mydapp/mydapp-hooks
```

根据你的具体需求，选择合适的命令即可。需要注意的是：
- `-w` 或 `--workspace-root` 表示安装在根目录
- `--filter` 用于指定特定的包
- `--workspace` 用于安装 workspace 中的本地包

- microbundle