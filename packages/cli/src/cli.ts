// src/cli.ts
import { program } from "commander";
import inquirer from "inquirer";
import { loadConfig } from "./config/index"; // 修改这里
import { generateInterface, saveInterface } from "./utils/interface-generator";
import { makeAuthenticatedRequest } from "./utils/auth";
import { AuthConfig } from "./types/config";
import axios from "axios";

/**
 * 收集认证信息
 * @param authType - 认证类型
 * @returns 认证配置对象
 */
async function collectAuthInfo(authType: string): Promise<AuthConfig> {
  const auth: AuthConfig = { type: authType as AuthConfig["type"] };

  switch (authType) {
    case "bearer":
      const { token } = await inquirer.prompt([
        {
          type: "password",
          name: "token",
          message: "Enter bearer token:",
          validate: (input) => input.length > 0 || "Token is required",
        },
      ]);
      auth.token = token;
      break;

    case "basic":
      const basicAuth = await inquirer.prompt([
        {
          type: "input",
          name: "username",
          message: "Enter username:",
          validate: (input) => input.length > 0 || "Username is required",
        },
        {
          type: "password",
          name: "password",
          message: "Enter password:",
          validate: (input) => input.length > 0 || "Password is required",
        },
      ]);
      auth.username = basicAuth.username;
      auth.password = basicAuth.password;
      break;

    case "custom":
      const customAuth = await inquirer.prompt([
        {
          type: "input",
          name: "headerName",
          message: "Enter header name:",
          validate: (input) => input.length > 0 || "Header name is required",
        },
        {
          type: "input",
          name: "headerValue",
          message: "Enter header value:",
          validate: (input) => input.length > 0 || "Header value is required",
        },
      ]);
      auth.headerName = customAuth.headerName;
      auth.headerValue = customAuth.headerValue;
      break;
  }

  return auth;
}

/**
 * CLI 主运行函数
 */
async function run() {
  try {
    // 加载配置
    const config = await loadConfig();

    // 收集基本信息
    const baseInfo = await inquirer.prompt([
      {
        type: "input",
        name: "url",
        message: "Enter API URL:",
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch (e) {
            return "Please enter a valid URL";
          }
        },
        default: config.apiPrefix,
      },
      {
        type: "list",
        name: "method",
        message: "Select HTTP method:",
        choices: ["GET", "POST", "PUT", "DELETE"],
      },
      {
        type: "input",
        name: "interfaceName",
        message: "Enter interface name:",
        default: "ApiResponse",
        validate: (input) => {
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return "Interface name must start with uppercase letter and contain only letters and numbers";
          }
          return true;
        },
      },
    ]);

    // 收集认证信息
    const { authType } = await inquirer.prompt([
      {
        type: "list",
        name: "authType",
        message: "Select authentication type:",
        choices: ["none", "bearer", "basic", "custom"],
      },
    ]);

    // 收集详细的认证信息
    const auth = await collectAuthInfo(authType);

    // 如果是 POST/PUT 请求，收集请求体
    let requestData;
    if (["POST", "PUT"].includes(baseInfo.method)) {
      const { body } = await inquirer.prompt([
        {
          type: "editor",
          name: "body",
          message: "Enter request body (JSON):",
          validate: (input) => {
            try {
              JSON.parse(input);
              return true;
            } catch (e) {
              return "Please enter valid JSON";
            }
          },
        },
      ]);
      requestData = JSON.parse(body);
    }

    // 发送请求
    console.log("\nSending request...");
    const response = await makeAuthenticatedRequest({
      url: baseInfo.url,
      method: baseInfo.method,
      auth,
      data: requestData,
    });

    // 生成接口
    console.log("Generating interface...");
    const interfaceDefinition = await generateInterface(
      JSON.stringify(response.data),
      baseInfo.interfaceName
    );

    // 询问是否保存到文件
    const saveInfo = await inquirer.prompt([
      {
        type: "confirm",
        name: "save",
        message: "Save interface to file?",
        default: true,
      },
      {
        type: "input",
        name: "filename",
        message: "Enter filename:",
        default: `${baseInfo.interfaceName}.ts`,
        when: (answers) => answers.save,
        validate: (input) => {
          if (!input.endsWith(".ts")) {
            return "Filename must end with .ts";
          }
          return true;
        },
      },
    ]);

    if (saveInfo.save) {
      await saveInterface(config, saveInfo.filename, interfaceDefinition);
    } else {
      console.log("\nGenerated interface:");
      console.log(interfaceDefinition);
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (axios.isAxiosError(error)) {
      console.error("Response:", error.response?.data);
    }
    process.exit(1);
  }
}

// 设置命令行程序
program
  .name("my-cli")
  .description(
    "CLI tool for generating TypeScript interfaces from API responses"
  )
  .version("1.0.0");

program
  .command("api")
  .description("Generate TypeScript interface from API response")
  .action(run);

program.parse();
