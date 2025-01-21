import { defineConfig } from "father";

export default defineConfig({
  esm: {
    input: "src/",
    output: "dist/esm"
  },
  // 如果你也需要 cjs 格式
  cjs: {
    input: "src/",
    output: "dist/cjs",
  },
  umd: {
    entry: "src/index.ts",
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
    output: "dist/umd",
  },
  
});
