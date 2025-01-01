const path = require("path");
const { spawn } = require("child_process");
const Logger = require("./log.js");
const fs = require(`fs`)
const logger = new Logger();

const tavernLogPath = path.join(process.cwd(), "log", "tavern.log");
const clewdLogPath = path.join(process.cwd(), "log", "clewd.log");

let tavern;
let clewd;
const startTavern = () => {
//   if (isTavernRunning()) {
//     logger.log(`酒馆正在运行！`, "ERROR", "red");
//     return;
//   }
if (tavern && !tavern.killed) {
    logger.log(`酒馆已在运行！`, "ERROR", "red");
    return;
}
// else if (!tavern.killed) {
//     logger.log(`酒馆已在运行！`, "ERROR", "red");
//     return;
// }
  tavern = spawn("powershell.exe", ["-Command", "node server.js"], {
    cwd: path.join(process.cwd(), "SillyTavern"),
    stdio: ["ignore", "pipe", "pipe"],
  });
    logger.log('酒馆运行成功，具体状态请查看日志文件', 'INFO','green')
  fs.appendFileSync(tavernLogPath, "[INFO]酒馆运行\n");

  tavern.stdout.on("data", (data) => {
    fs.appendFileSync(tavernLogPath, `[INFO] ${data}\n`);
  });

  tavern.stderr.on("data", (data) => {
    fs.appendFileSync(tavernLogPath, `[ERROR] ${data}\n`);
  });

    tavern.on("close", (code) => {
      logger.log(`酒馆终止，如为正常关闭请忽视`, "INFO", "RED");
      fs.appendFileSync(tavernLogPath, `[INFO]进程以代码 ${code} 退出 \n`);
    });
  // 监听spawn本身的错误（例如目录不存在）
  tavern.on("error", (err) => {
    logger.log(`酒馆启动失败或出现错误，详情请查看文件`, "ERROR", "red");
    logger.logf(err, "ERROR", "red");
  });

    clearProcess();

};
const startClewd = () => {

    if (clewd && !clewd.killed) {
      logger.log(`Clewd已在运行！`, "ERROR", "red");
      return;
    }
    // else if (!clewd.killed) {
    //   logger.log(`Clewd已在运行！`, "ERROR", "red");
    //   return;
    // }
    logger.log("Clewd运行成功，具体状态请查看日志文件", "INFO", "green");

  clewd = spawn("powershell.exe", ["-Command", "node clewd.js"], {
    cwd: path.join(process.cwd(), "clewd"),
    stdio: ["ignore", "pipe", "pipe"],
  });
  fs.appendFileSync(clewdLogPath, "[INFO] clewd运行\n");

  clewd.stdout.on("data", (data) => {
    fs.appendFileSync(clewdLogPath, `[INFO] ${data}\n`);
  });

  clewd.stderr.on("data", (data) => {
    fs.appendFileSync(clewdLogPath, `[ERROR] ${data}\n`);
  });

    clewd.on("close", (code) => {
      logger.log(`Clewd终止，如为正常关闭请忽视`, "INFO", "RED");
      fs.appendFileSync(clewdLogPath, `[INFO]进程以代码 ${code} 退出 \n`);
    });

  clewd.on("error", (err) => {
    logger.log(`Clewd启动失败或出现错误,详情请查看文件`, "ERROR", "red");
    logger.logf(err, "ERROR", "red");
  });
  clearProcess();
};
const clearProcess = () => {
  const killProcesses = () => {
    return new Promise((resolve, reject) => {
      let killCount = 0;
      let killError = null;
      const tryKill = (processName, processInstance) => {
        if (processInstance) {
          processInstance.kill((err) => {
            if (err) {
              killError = killError || err;
            }
            killCount++;
            if (killCount === 2) {
   
              if (killError) {
                reject(killError); 
              } else {
                resolve(); 
              }
            }
          });
        } else {
          killCount++;
          if (killCount === 2) resolve();
        }
      };

      tryKill("tavern", tavern);
      tryKill("clewd", clewd);
    });
  };

  
  process.on("exit", async () => {
    try {
      await killProcesses(); 
    } catch (error) {

    }
  });

  process.on("SIGINT", async () => {
    try {
      await killProcesses(); 
    } catch (error) {
    }
    process.exit(); 
  });

  process.on("beforeExit", async () => {
    try {
      await killProcesses(); 
    } catch (error) {
      console.error("清理进程时出错:", error);
    }
    process.exit(1); 
  });
};





module.exports = { startTavern, startClewd, clearProcess };