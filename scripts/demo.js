// const path = require("path");
// const fs = require("fs");
const packageInfo = require("../package.json");
// const ENV = process.env;
// const args = process.argv.slice(2);
console.log(
  `项目名：${packageInfo.name} 脚本文件夹路径:${__dirname} 脚本路径:${__filename}`
);
