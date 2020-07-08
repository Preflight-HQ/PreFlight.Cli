#!/usr/bin/env node

const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');
import chalk from 'chalk';
import { Executor } from './executor';

clear();
console.log(
  chalk.green(
    figlet.textSync('preflight', { horizontalLayout: 'full' })
  )
);

program.version('0.0.1')

/*
program
  .command('login')
  .description('Login to Preflight')
  .option('-i, --clientId <clientId>', 'Preflight client id')
  .option('-s, --clientSecret <clientSecret>', 'Preflight client secret')
  .action(async (opts:any) => {
    console.log(opts);
    let executor = new Executor(opts);
    await executor.login();
});
*/

program
  .command('run')
  .description('Run tests on Preflight')
  .option('-i, --clientId [clientId]', 'Preflight client id')
  .option('-s, --clientSecret [clientSecret]', 'Preflight client secret')
  .option('-t, --testId [testId]', 'Test id')
  .option('-g, --groupId [groupId]', 'Group id')
  .option('-e, --environmentId [environmentId]', 'Environment id')
  .option('-b, --browsers [browsers]', 'Platforms and browsers')
  .option('-x, --sizes [sizes]', 'Sizes')
  .option('-c, --noScreenshot', 'Dont capture screenshots')
  .option('-w, --noWaitResult', 'Dont wait tests results')
  .action(async (opts:any) => {
    console.log(opts);
    let executor = new Executor(opts);
    await executor.run();
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
