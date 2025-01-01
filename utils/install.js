const path = require("path");
const { exec } = require("child_process");
const Logger = require("./log.js");
const logger = new Logger();

// 提前下载好的静态资源，存放在打包好后exe同目录的/env下即可
const nodePath = path.join(process.cwd(), "env", "node-v22.12.0-x64.msi");
const gitPath = path.join(process.cwd(), "env", "Git-2.47.1-64-bit.exe");
const tavernPath = path.join(process.cwd(), "SillyTavern");
const clewdPath = path.join(process.cwd(), "clewd");

const installURL = {
  tavernGitURL: "https://github.com/SillyTavern/SillyTavern.git",
  tavernGitURL_CN: "https://kkgithub.com/SillyTavern/SillyTavern.git", // 镜像站
  clewdGitURL: "https://github.com/teralomaniac/clewd.git",
  clewdGitURL_CN: "https://kkgithub.com/teralomaniac/clewd.git", // 镜像站
  npmURL: "https://registry.npmjs.org/",
  npmURL_CN: "https://mirrors.cloud.tencent.com/npm/", // 腾讯云npm源
};

// const installPm2 = (url) => {
//      return new Promise((resolve, reject) => {
//        exec(
//          `powershell.exe -Command "npm install pm2 -g`,
//          (err, stdout, stderr) => {
//            if (err || stderr) {
//              logger.logf(err || stderr);
//              logger.log(
//                `Pm2安装失败,具体日志请查看log文件`,
//                "ERROR",
//                "red"
//              );
//              resolve();
//            } else {
//              logger.log(
//                "Pm2安装完毕,请 重启脚本 检查环境查看是否成功",
//                "INFO",
//                "green"
//              );
//              resolve();
//            }
//          }
//        );
//      });

// }

const installNode = () => {
  return new Promise((resolve, reject) => {
    exec(
      `msiexec /i "${nodePath}"  /passive /quiet /norestart`,
      (err, stdout, stderr) => {
        if (err || stderr) {
          logger.logf(err || stderr);
          logger.log(`Node.js安装失败,具体日志请查看log文件`, "ERROR", "red");
          resolve();
        } else {
          logger.log(
            "Node.js安装完毕,请 重启脚本 检查环境查看是否成功",
            "INFO",
            "green"
          );
          resolve();
        }
      }
    );
  });
};

const installGit = () => {
  return new Promise((resolve, reject) => {
    exec(`"${gitPath}"  /VERYSILENT /NORESTART`, (err, stdout, stderr) => {
      if (err || stderr) {
        logger.logf(err);
        logger.log(`Git安装失败,具体日志请查看log文件`, "ERROR", "red");
        resolve();
      } else {
        logger.log(
          "Git安装完毕,请 重启脚本 检查环境查看是否成功",
          "INFO",
          "green"
        );
        resolve();
      }
    });
  });
};

const downloadTavern = (url) => {
  return new Promise((resolve, reject) => {
    exec(`git.exe clone ${url}`, (err, stdout, stderr) => {
      if (err || (stderr && stderr.includes("fatal"))) {
        logger.logf(err || stderr);
        logger.log(`酒馆下载失败,请查看log文件`, "ERROR", "red");
        resolve();
      } else {
        logger.log("酒馆下载完毕，请选择安装酒馆", "INFO", "green");
        logger.logf(stdout);
        resolve();
      }
    });
  });
};

const installTavern = (url) => {
  // 懒了，后续再写Linux
  // switch (envInfo.os) {
  //     case "Windows":
  //         break;
  //     case "Linux":
  //         break;
  // }
  return new Promise((resolve, reject) => {
    exec(
      `powershell.exe -Command "npm install --registry=${url}"`,
      { cwd: tavernPath },
      (err, stdout, stderr) => {
        if (stderr && stderr.match(/deprecated|warn/)) {
          stderr = ""; // 忽略所有包含 "deprecated" 或 "warn" 的警告信息
        }
        if (err || stderr) {
          logger.logf(err || stderr);
          logger.log(`酒馆配置安装失败,请查看log文件`, "ERROR", "red");
          resolve();
        } else {
          logger.log("酒馆安装完毕,可以启动了!", "INFO", "green");
          resolve();
        }
      }
    );
  });
};
const downloadClewd = (url) => {
  return new Promise((resolve, reject) => {
    exec(`git.exe clone -b test ${url}`, (err, stdout, stderr) => {
      if (err || (stderr && stderr.includes("fatal"))) {
        logger.logf(err || stderr);
        logger.log(`Clewd下载失败,请查看log文件`, "ERROR", "red");
        resolve();
      } else {
        logger.log("Clewd下载完毕,请选择安装Clewd", "INFO", "green");
        logger.logf(stdout);
        resolve();
      }
    });
  });
};

const installClewd = (url) => {
  return new Promise((resolve, reject) => {
    exec(
      `powershell.exe -Command "npm install --registry=${url}"`,
      { cwd: clewdPath },
      (err, stdout, stderr) => {
        if (err || stderr) {
          logger.logf(err);
          logger.log(`Clewd配置安装失败,请查看log文件`, "ERROR", "red");
          resolve();
        } else {
          logger.log("Clewd安装完毕,可以启动了!", "INFO", "green");
          resolve();
        }
      }
    );
  });
};

module.exports = {
  installNode,
  installGit,
  installURL,
  installTavern,
  downloadTavern,
  installClewd,
  downloadClewd,
};
