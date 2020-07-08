#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');
const chalk_1 = __importDefault(require("chalk"));
const executor_1 = require("./executor");
clear();
console.log(chalk_1.default.green(figlet.textSync('preflight', { horizontalLayout: 'full' })));
program.version('0.0.1');
program
    .command('login')
    .description('Login to Preflight')
    .option('-i, --clientId <clientId>', 'Preflight client id')
    .option('-s, --clientSecret <clientSecret>', 'Preflight client secret')
    .action((opts) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(opts);
    let executor = new executor_1.Executor(opts);
    yield executor.login();
}));
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
    .action((opts) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(opts);
    let executor = new executor_1.Executor(opts);
    yield executor.run();
}));
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
