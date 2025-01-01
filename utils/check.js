const os = require("os");
const { exec } = require("child_process");
const Logger = require("./log.js");
const logger = new Logger();

// 检查环境

const envInfo = {
  node: false,
  node_info: ``,
  // nvm: false,
  // nvm_info: ``,
  git: false,
  git_info: ``,
  silly: false,
  silly_info: ``,
  clewd: false,
  clewd_info: ``,
  os: "Windows",
};

const checkEnvironment = async () => {
  try {
    logger.log(`正在检查环境`);
    const operatingSystem = getOS();
    await checkGit();
    await checkNode();
    // await checkNvm();
    logger.log(`当前系统: ${operatingSystem}`);
    logger.log(`Git 信息: ${envInfo.git_info}`);
    logger.log(`Node.js 信息: ${envInfo.node_info}`);
  } catch (error) {
    console.error(error);
    logger.log(error.message, "ERROR", "red");
    logger.logf(error);
  }
};

// 系统
const getOS = () => {
  const platform = os.platform();
  switch (platform) {
    case "win32":
      envInfo.os = "Windows";
      return "Windows";
    case "darwin":
      envInfo.os = "macOS";
      return "macOS";
    case "linux":
      envInfo.os = "Linux";
      return "Linux";
    default:
      envInfo.os = "Unknown OS";
      return "Unknown OS";
  }
};

//  Git
const checkGit = () => {
  return new Promise((resolve, reject) => {
    exec("git -v", { encoding: "utf8" }, (err, stdout, stderr) => {
      if (err || stderr) {
          envInfo.git = false;
          logger.logf(`${err}`, `ERROR`);
        envInfo.git_info = stderr.split("\n")[0];
        resolve();
      } else {
        envInfo.git = true;
        envInfo.git_info = stdout.trim();
        resolve();
      }
    });
  });
};

// Node
const checkNode = () => {
  return new Promise((resolve, reject) => {
    exec(
      'powershell.exe -Command "node -v"',
      { encoding: "utf8" },
      (err, stdout, stderr) => {
        if (err || stderr) {
          envInfo.node = false;
          logger.logf(`${err}`,`ERROR`);
          envInfo.node_info = stderr.split("\n")[0];
          resolve();
        } else {
          envInfo.node = true;
          envInfo.node_info = stdout.trim();
          resolve();
        }
      }
    );
  });
};
// nvm原因导致exec无法使用nvm ,使用nvm安装node的美梦破灭(悲伤
// https://github.com/coreybutler/nvm-windows/issues/1068

// const checkNvm = () => {
//   return new Promise((resolve, reject) => {
//     exec(`nvm -v`,
//       (err, stdout, stderr) => {
//         if (err || stderr) {
//           envInfo.nvm = false;
//           reject("NVM 未安装");
//         } else {
//           envInfo.nvm = true;
//           resolve(stdout.trim());
//         }
//       }
//     );
//   });
// };

module.exports = { checkEnvironment, envInfo };
