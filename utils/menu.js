const inquirer = require("inquirer");
const { checkEnvironment, envInfo } = require("./check.js");
const { startTavern, startClewd, clearProcess } = require("./start.js");
const InquirerPrompt = inquirer.createPromptModule();
const Logger = require("./log.js");
const logger = new Logger();
const {
  installNode,
  installGit,
  installURL,
  installTavern,
  downloadTavern,
  installClewd,
  downloadClewd,
} = require("./install.js");
// 运行
async function runMenu() {
  logger.log(`关闭本脚本则同时关闭clewd和酒馆`)
  logger.log(`酒馆和clewd日志会保存到目录下/log/xxx.log`)
  logger.log(`如出现报错建议访问文件查看完整日志`)
  const run_menu = await InquirerPrompt([
    {
      type: "list",
      name: "action",
      message: " 启动菜单 - by:Mueo ",
      choices: [
        "启动酒馆",
        "启动Clewd",

        "返回主菜单",
        "退出",
      ],
    },
  ]);
  logger.logf(`启动菜单 - by:Mueo : ${run_menu.action}`);
  switch (run_menu.action) {
    case "启动酒馆":
      startTavern();
      runMenu();
      break;
    case "启动Clewd":
      startClewd();
      runMenu();
      break;
    case "返回主菜单":
      mainMenu();
      break;
    case "退出":
      logger.log("程序退出");
      clearProcess();
      process.exit();
  }
}
// 安装
async function installTavernMenu() {
  logger.log("请保证已经安装了Git和Node.js后再安装酒馆");
  logger.log("先下载.然后安装配置");
  logger.log(
    "下载和安装配置推荐使用魔法环境，没有魔法环境可以尝试镜像站和国内源"
  );
  logger.log("镜像站和国内源 不保证100%可用");
  const tavern_menu = await InquirerPrompt([
    {
      type: "list",
      name: "action",
      message: " 安装酒馆 - by:Mueo ",
      choices: [
        "下载-酒馆",
        "下载-酒馆(镜像站)",
        "安装配置",
        "安装配置(国内源)",
        "返回上一级",
        "退出",
      ],
    },
  ]);
  logger.logf(`安装酒馆 - by:Mueo : ${tavern_menu.action}`);
  switch (tavern_menu.action) {
    case "下载-酒馆":
      await downloadTavern(installURL.tavernGitURL);
      installTavernMenu();
      break;
    case "下载-酒馆(镜像站)":
      await downloadTavern(installURL.tavernGitURL_CN);
      installTavernMenu();
      break;
    case "安装配置":
      await installTavern(installURL.npmURL);
      installTavernMenu();
      break;
    case "安装配置(国内源)":
      await installTavern(installURL.npmURL_CN);
      installTavernMenu();
      break;
    case "返回上一级":
      installMenu();
      break;
    case "退出":
      logger.log("程序退出");
      clearProcess();
      process.exit();
  }
}
async function installClewdMenu() {
  logger.log("请保证已经安装了Git和Node.js后再安装Clewd");
  logger.log("先下载.然后安装配置");
  logger.log(
    "下载和安装配置推荐使用魔法环境，没有魔法环境可以尝试镜像站和国内源"
  );
  logger.log("镜像站和国内源 不保证100%可用");
  const clewd_menu = await InquirerPrompt([
    {
      type: "list",
      name: "action",
      message: " 安装Clewd - by:Mueo ",
      choices: [
        "下载-Clewd",
        "下载-Clewd(镜像站)",
        "安装配置",
        "安装配置(国内源)",
        "返回上一级",
        "退出",
      ],
    },
  ]);
  logger.logf(`安装Clewd - by:Mueo : ${clewd_menu.action}`);
  switch (clewd_menu.action) {
    case "下载-Clewd":
      await downloadClewd(installURL.clewdGitURL);
      installClewdMenu();
      break;
    case "下载-Clewd(镜像站)":
      await downloadClewd(installURL.clewdGitURL_CN);
      installClewdMenu();
      break;
    case "安装配置":
      await installClewd(installURL.npmURL);
      installClewdMenu();
      break;
    case "安装配置(国内源)":
      await installClewd(installURL.npmURL_CN);
      installClewdMenu();
      break;
    case "返回上一级":
      installMenu();
      break;
    case "退出":
      logger.log("程序退出");
      clearProcess();
      process.exit();
  }
}

async function installMenu() {
  logger.log("请务必先安装Git和Node.js,然后安装pm2");
  const install_menu = await InquirerPrompt([
    {
      type: "list",
      name: "action",
      message: " 安装菜单 - by:Mueo ",
      choices: [
        "安装酒馆",
        "安装Clewd",
        "安装Node.js",
        "安装Git",
        "返回主菜单",
        "退出",
      ],
    },
  ]);
  logger.logf(`安装菜单 - by:Mueo : ${install_menu.action}`);
  switch (install_menu.action) {
    case "安装酒馆":
      installTavernMenu();
      break;
    case "安装Clewd":
      installClewdMenu();
      break;
    case "安装Git":
      logger.log("安装Git部分完善中...出现问题不要惊讶");
      await installGit();
      installMenu();
      break;
    case "安装Node.js":
      logger.log("安装Node部分完善中...出现问题不要惊讶");
      await installNode();
      installMenu();
      break;
    case "返回主菜单":
      mainMenu();
      break;
    case "退出":
      logger.log("程序退出");
      clearProcess();
      process.exit();
  }
}
// 设置
async function setMenu() {
  const set_menu = await InquirerPrompt([
    {
      type: "list",
      name: "action",
      message: " 设置菜单 - by:Mueo ",
      choices: ["修改酒馆config", "修改Clewd配置", "返回主菜单", "退出"],
    },
  ]);
  logger.logf(`设置菜单 - by:Mueo : ${set_menu.action}`);
  switch (set_menu.action) {
    case "修改酒馆config":
      break;
    case "修改Clewd配置":
      break;
    case "返回主菜单":
      mainMenu();
      break;
    case "退出":
      logger.log("程序退出");
      clearProcess();
      process.exit();
  }
}
// 主菜单
async function mainMenu() {
  const main_menu = await InquirerPrompt([
    {
      type: "list",
      name: "action",
      message: " 主菜单 - by:Mueo ",
      choices: [
        "启动菜单",
        "安装菜单",
        "配置修改",
        "检查环境",
        "相关说明",
        "退出",
      ],
    },
  ]);
  logger.logf(`主菜单 - by:Mueo : ${main_menu.action}`);
  switch (main_menu.action) {
    case "启动菜单":
      runMenu();
      break;
    case "安装菜单":
      installMenu();
      break;
    case "配置修改":
      setMenu();
      break;
    case "检查环境":
      await checkEnvironment();
      mainMenu();
      break;
    case "相关说明":
      console.log(envInfo);
      mainMenu();
      break;
    case "退出":
      logger.log("程序退出");
      clearProcess();
      process.exit();
  }
}

module.exports = { mainMenu };
