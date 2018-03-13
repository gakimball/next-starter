/* eslint-disable no-console */

const fs = require('fs');
const errorStackParser = require('error-stack-parser');
const chalk = require('chalk');
const codeFrame = require('babel-code-frame');

module.exports = (err) => {
  const [{ fileName, lineNumber, columnNumber }] = errorStackParser.parse(err);
  const file = fs.readFileSync(fileName).toString();

  console.log(chalk.red.bold('Error in server execution:\n'));
  console.log(codeFrame(file, lineNumber, columnNumber, { highlightCode: true }));
  console.log(`\n${err.message}`);
  console.log(chalk.gray(`${fileName}:${lineNumber}:${columnNumber}\n`));
};
