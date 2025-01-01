const { checkEnvironment, envInfo } = require("./utils/check.js");
const { mainMenu } = require("./utils/menu.js");
const path = require('path')
const fs = require("fs");
const Logger = require("./utils/log.js");
const logger = new Logger();


// const setUTF8 = () => {
//     return new Promise((resolve, reject) => {
//   exec("chcp 65001", (err, stdout, stderr) => {
//     if (err) {
//       logf(err.message,'ERROR');
//       resolve();
//     } else {
//       resolve();
//     }
//   });
//     });
// }



const clearProcesses = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      resolve();
    }

    // 读取 config.json 
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        logger.logf(`"读取config失败:" ${err}`, "ERROR");
        resolve();
      }

      try {
        const configData = JSON.parse(data);
        const pidList = configData.pid;

        if (!pidList || !Array.isArray(pidList)) {
          logger.logf("config.json 中的 pid 无效", "ERROR");
          resolve();
        }

        pidList.forEach((pidObj) => {
          Object.keys(pidObj).forEach((pidKey) => {
            const pid = pidObj[pidKey];
            if (pid && !isNaN(pid)) {
              killProcess(pid, pidKey, pidObj, configData);
            }
          });
        });
        resolve();
      } catch (parseError) {
        logger.log(`解析 config.json 时出错: ${parseError}`, "ERROR", "red");
        resolve();
      }
    });
  });
}

// 杀死指定的进程
function killProcess(pid, pidKey, pidObj, configData) {
  exec(`kill ${pid}`, (err, stdout, stderr) => {
    if (err) {
      logger.logf(`无法终止进程 ${pid}: ${err}`, "ERROR");
    } else {
      logger.logf(`进程 ${pid} 已被杀死`);

      pidObj[pidKey] = "";

      // 更新 config.json 文件
      fs.writeFile(path, JSON.stringify(configData, null, 2), (writeErr) => {
        if (writeErr) {
          logger.logf(`更新 config.json 失败:${writeErr}`);
        } else {
          logger.logf(`config.json 文件已更新`);
        }
      });
    }

    if (stderr) {
      logger.logf(`错误: ${stderr}`, "ERROR");
    }

    if (stdout) {
      logger.logf(`输出: ${stdout}`, "ERROR");
    }
  });
}


const creatConfig = () => {
  let path = `./config.json`;
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      const configData = {
        cookies: [],
        pid: [
          {
            tavern:"",
            clewd: "",
          },
        ],
      };
      const jsonData = JSON.stringify(configData, null, 2);
      fs.writeFile(path, jsonData, (err) => {
        if (err) {
          logger.log("创建config失败,请以管理员权限运行", "ERROR", "red");
          logger.logf(err);
          resolve();
        } else {
          logger.log("创建config成功", "INFO", "green");
          resolve();
        }
      });
    } else {
      resolve();
      logger.log("读取到config", "INFO", "green");
    }
  });
}

const startApp = async () => {
  // 初始化
  // await setUTF8();

  logger.log(`一键启动脚本 - by:Mueo`);
  logger.log(`当前版本:1.0.0  -  本项目开源且遵循MIT License`);
  logger.log(`编码:UTF-8,如不支持则可能出现部分报错/异常为乱码，为正常现象`);
  logger.log(`请以 管理员权限 并在 魔法环境 下运行`);
  logger.log(`如使用出现问题请携带完整日志询问`);
  await clearProcesses();
  await creatConfig(); 
  await checkEnvironment();
  logger.log(`初始化完毕`,'INFO','green');
  mainMenu();
};

startApp();
