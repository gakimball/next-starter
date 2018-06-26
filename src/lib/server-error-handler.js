/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const errorStackParser = require('error-stack-parser');
const chalk = require('chalk');
const codeFrame = require('babel-code-frame');

module.exports = (err) => {
  const [{ fileName, lineNumber, columnNumber }] = errorStackParser.parse(err);
  const filePath = path.join(process.cwd(), fileName.replace('webpack:///', '').replace(/\?$/, ''));
  const file = fs.readFileSync(filePath).toString();

  console.log(chalk.red.bold('Error in server execution:\n'));
  console.log(codeFrame(file, lineNumber, columnNumber, { highlightCode: true }));
  console.log(`\n${err.message}`);
  console.log(chalk.gray(`${fileName}:${lineNumber}:${columnNumber}\n`));
};
