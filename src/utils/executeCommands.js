// src/utils/executeCommands.js
const { spawn } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');

async function executeCommands(commands = [], cwd, projectName) {
  if (!commands.length) return;

  console.log(chalk.blue('\nRunning setup commands...\n'));
  
  // Track the current working directory
  let currentCwd = cwd;

  for (const cmd of commands) {
    // Replace variables in command
    const command = cmd.command.replace(/\{\{projectName\}\}/g, projectName);
    
    // Special handling for cd commands to update the working directory
    if (command.startsWith('cd ')) {
      const targetDir = command.substring(3).trim();
      
      // Update the current working directory
      if (targetDir === '{{projectName}}' || targetDir === projectName) {
        currentCwd = path.join(cwd, projectName);
        console.log(chalk.cyan(`> ${command} (updating working directory)`));
      } else if (path.isAbsolute(targetDir)) {
        currentCwd = targetDir;
        console.log(chalk.cyan(`> ${command} (updating working directory)`));
      } else {
        currentCwd = path.join(currentCwd, targetDir);
        console.log(chalk.cyan(`> ${command} (updating working directory)`));
      }
      
      // Continue to the next command
      continue;
    }
    
    console.log(chalk.cyan(`> ${command}`));
    
    // Parse command string into command and args
    const [executable, ...args] = command.split(' ');
    
    // Handle interactive commands
    if (cmd.interactive) {
      await executeInteractiveCommand(executable, args, cmd.inputs, currentCwd, projectName);
    } else {
      // Execute normal command
      await new Promise((resolve, reject) => {
        const proc = spawn(executable, args, {
          cwd: currentCwd,
          stdio: 'inherit',
          shell: process.platform === 'win32' // Use shell on Windows
        });
        
        proc.on('close', code => {
          if (code !== 0) {
            reject(new Error(`Command failed with exit code ${code}`));
          } else {
            resolve();
          }
        });
      });
    }
  }
}


// Function to handle interactive commands with predetermined inputs
async function executeInteractiveCommand(cmd, args, inputs, cwd, projectName) {
  return new Promise((resolve, reject) => {
    console.log(chalk.yellow('Automating interactive prompts...'));
    
    // For npm create vite, use a more direct approach
    if (cmd === 'npm' && args[0] === 'create' && args[1].includes('vite')) {
      // Use the --template flag directly for vite
      const projectNameIndex = args.findIndex(arg => arg === '{{projectName}}' || arg.includes(projectName));
      
      if (projectNameIndex !== -1) {
        // Remove any placeholder args
        const cleanArgs = args.filter((arg, index) => 
          index <= projectNameIndex || (arg !== '--' && !arg.startsWith('--template'))
        );
        
        // Add template argument directly
        cleanArgs.push('--template');
        cleanArgs.push('react');
        
        console.log(chalk.cyan(`> Executing: ${cmd} ${cleanArgs.join(' ')}`));
        
        // Execute with direct template specification
        return new Promise((resolve, reject) => {
          const proc = spawn(cmd, cleanArgs, {
            cwd,
            stdio: 'inherit',
            shell: process.platform === 'win32'
          });
          
          proc.on('close', code => {
            if (code !== 0) {
              reject(new Error(`Command failed with exit code ${code}`));
            } else {
              resolve();
            }
          });
        }).then(resolve).catch(reject);
      }
    }
    
    // For other interactive commands, use the original approach
    const proc = spawn(cmd, args, {
      cwd,
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: process.platform === 'win32'
    });
    
    let currentInputIndex = 0;
    
    // Process inputs sequentially
    const processNextInput = () => {
      if (currentInputIndex < inputs.length) {
        const input = inputs[currentInputIndex];
        
        // Handle different types of inputs
        if (input.type === 'selection') {
          // For selection inputs (like choosing React from a list)
          console.log(chalk.dim(`[Automated selection: ${input.value}]`));
          
          // First navigate to the option (arrow keys)
          let arrowPresses = input.position || 2; // Default position for React in Vite CLI
          
          const sendArrows = () => {
            if (arrowPresses > 0) {
              // Send down arrow key
              proc.stdin.write('\u001B[B');
              arrowPresses--;
              setTimeout(sendArrows, 200); // Slightly longer delay between arrow presses
            } else {
              // When we've reached the position, press Enter
              setTimeout(() => {
                proc.stdin.write('\n');
                currentInputIndex++;
                processNextInput();
              }, 500); // Longer delay before Enter
            }
          };
          
          // Start sending arrow keys after delay
          setTimeout(sendArrows, input.delay || 2000); // Longer initial delay
        } else {
          // Standard text input
          const value = input.value.replace(/\{\{projectName\}\}/g, projectName);
          console.log(chalk.dim(`[Automated input: ${value}]`));
          
          // Wait specified delay before sending input
          setTimeout(() => {
            proc.stdin.write(value + '\n');
            currentInputIndex++;
            processNextInput();
          }, input.delay || 1000);
        }
      }
    };
    
    // Start processing inputs
    processNextInput();
    
    proc.on('close', code => {
      if (code !== 0) {
        reject(new Error(`Interactive command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = executeCommands;