#!/usr/bin/env node
import program from 'commander';
import { version } from '../../package.json';
import getDiff from '..';

export default program
  .description('Compares two configuration files and shows a difference')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format')
  .option('-V, --version', 'output the version number')
  .version(version)
  .action((firstConfig, secondConfig, format) => {
    console.log(getDiff(firstConfig, secondConfig, format));
  })
  .parse(process.argv);
