// src/utils/generateFiles.js
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function generateFiles(templateConfig, projectName, projectPath) {
  // Skip if no dynamic files defined
  if (!templateConfig.dynamicFiles || !templateConfig.dynamicFiles.length) {
    return;
  }
  
  const templateDir = path.join(__dirname, '../templates', templateConfig.directory || '');
  
  console.log(chalk.blue('\nGenerating additional project files...\n'));
  
  try {
    // Check if template directory exists before copying
    if (templateConfig.directory && await fs.pathExists(templateDir)) {
      // Copy template files to project directory
      await fs.copy(templateDir, projectPath);
      console.log(chalk.green('Template files copied'));
    }
    
    // Process dynamic files
    for (const file of templateConfig.dynamicFiles) {
      const filePath = path.join(projectPath, file.path);
      const dirPath = path.dirname(filePath);
      
      // Create directory if needed
      await fs.ensureDir(dirPath);
      
      // Create file with content
      if (file.content) {
        // Replace template variables
        let content = file.content.replace(/\{\{projectName\}\}/g, projectName);
        
        await fs.writeFile(filePath, content);
        console.log(chalk.green(`Created file: ${file.path}`));
      }
    }
  } catch (error) {
    console.error(chalk.red('Error generating files:'), error);
    throw error;
  }
}

module.exports = generateFiles;