const chalk = require("chalk");
const fs = require("fs");
// 自写Log输出和保存 
// 比较粗糙，总比console.log好用（好看

// 时间戳
function getTimesTamp() {
  const now = new Date();
  return `${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getHours()}:${now.getMinutes()}`;
}

class Logger {
  constructor() {
    if (!Logger.instance) {
      Logger.instance = this;
    }
    this.logs = []; // 队列
    this.isWriting = false;
    return Logger.instance;
  }

  // 普通
  log(message = `未定义的INFO日志信息`, type = "INFO", color = "blue") {
    const timestamp = getTimesTamp();
    if (chalk[color]) {
      console.log(
        chalk.hex("#00cccc")(`[${timestamp}] `) +
          chalk[color].bold(`[${type}]`) +
          ` ${message}`
      );

      this.addlogs(`[${timestamp}] [${type}] ${message}`);
    } else {
      console.log(
        chalk.hex("#00cccc")(`[${timestamp}] `) +
          chalk.blue.bold(`[${type}]`) +
          ` ${message}`
      );

      this.addlogs(`[${timestamp}] [${type}] ${message}`);
    }
  }
  // 不输出内容只保存到文件
  logf(message = `未定义的INFO日志信息`, type = "INFO", color = "blue") {
    const timestamp = getTimesTamp();
    this.addlogs(`[${timestamp}] [${type}] ${message}`);
  }

  addlogs(log) {
    this.logs.push(log);
    this.saveLog();
  }

  // 保存
  async saveLog() {
    if (this.isWriting) return;
    if (this.logs.length === 0) return;
    this.isWriting = true;
    let logMessage = this.logs.shift();

    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    const logFileName = `./log/${dateStr}.log`;

    logMessage = logMessage.replace(/\x1b\[[0-9;]*m/g, "");

    try {
      await fs.promises.mkdir("./log", { recursive: true }); 
      fs.appendFileSync(logFileName, logMessage + "\n"); 
    } catch (err) {
      console.error("无法保存日志到文件,请检查程序权限等问题", err.message);
    } finally {
      this.isWriting = false; 
      this.saveLog(); 
    }
  }
}

module.exports = Logger;
