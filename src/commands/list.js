const chalk = require('chalk');
const { getAllTemplates } = require('../config');

function list() {
  const templates = getAllTemplates();
  
  console.log(chalk.blue('\nAvailable templates:\n'));
  
  Object.entries(templates).forEach(([name, config]) => {
    console.log(chalk.green(`${name}:`));
    console.log(`  ${config.description || 'No description provided'}`);
    console.log();
  });
  
  console.log(`Use ${chalk.cyan('devstack create <template-name> <project-name>')} to create a project\n`);
}

module.exports = list;