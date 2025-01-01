# Mueo-Autoinstall-TC

 自动安装酒馆、clewd以及配套环境

## 如何使用？
安装依赖
```shell
npm install
```
运行
```
node app.js
```

## 构建
因为可能存在bug，没有上传打包后的`exe`，可到相关群下载  

如果你不信任，也可以自行打包

```
# 安装pkg
npm install pkg -g
# 打包
npm run build
```

### 注意:
请自行配置于 `package.json` 中的如下内容，防止构建出现问题
```
    "pkg": {
    "scripts": ["app.js"],  
    "targets": ["node18-win-x64"]
  },
```