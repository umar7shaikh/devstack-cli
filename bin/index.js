#!/usr/bin/env node

const { Command } = require('commander'); // Import Command constructor
const program = new Command(); // Create a new command instance
const { create, list } = require('../src/commands');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .description('DevStack CLI - Scaffold projects across different tech stacks');

program
  .command('create <template> <project-name>')
  .description('Create a new project from a template')
  .action(create);

program
  .command('list')
  .description('List all available templates')
  .action(list);

program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}