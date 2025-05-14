// src/commands/create.js
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { executeCommands, generateFiles } = require('../utils');
const { getTemplateConfig } = require('../config');

async function create(templateName, projectName) {
  try {
    console.log(chalk.blue(`Creating new ${templateName} project: ${projectName}`));
    
    // Get template configuration
    const templateConfig = getTemplateConfig(templateName);
    if (!templateConfig) {
      console.log(chalk.red(`Template "${templateName}" not found.`));
      return;
    }
    
    // Execute commands defined in template
    await executeCommands(templateConfig.commands, process.cwd(), projectName);
    
    // Generate any additional files if needed
    if (templateConfig.dynamicFiles && templateConfig.dynamicFiles.length > 0) {
      const projectPath = path.join(process.cwd(), projectName);
      await generateFiles(templateConfig, projectName, projectPath);
    }
    
    console.log(chalk.green(`\n✅ Project ${projectName} created successfully!`));
    console.log(`\nNext steps:`);
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npm run dev (or the appropriate command for your project)\n`));
    
  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
  }
}

module.exports = create;