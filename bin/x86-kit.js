#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

const program = new Command();
const PKG_ROOT = path.join(__dirname, '..');

const banner = `
   ██╗  ██╗ █████╗  ██████╗       ██╗  ██╗██╗████████╗
   ╚██╗██╔╝██╔══██╗██╔════╝       ██║ ██╔╝██║╚══██╔══╝
    ╚███╔╝ ╚█████╔╝███████╗ █████╗█████╔╝ ██║   ██║   
    ██╔██╗ ██╔══██╗██╔═══██╗╚════╝██╔═██╗ ██║   ██║   
   ██╔╝ ██╗╚█████╔╝╚██████╔╝      ██║  ██╗██║   ██║   
   ╚═╝  ╚═╝ ╚════╝  ╚═════╝       ╚═╝  ╚═╝╚═╝   ╚═╝   

   x86-kit - The Ultimate Antigravity & GSD Kit for Claude/Gemini
   A unified agentic toolkit.
`;

program
  .name('x86-kit')
  .description('CLI tool to install and manage the unified x86-kit')
  .version('1.0.0', '-v, --version', 'Display version number');

program
  .command('init')
  .description('Install .x86-kit folder into your project and setup symlinks')
  .action(() => {
    console.log(pc.cyan(banner));
    const targetDir = process.cwd();
    const sourceX86Kit = path.join(PKG_ROOT, '.x86-kit');
    
    // In actual usage, these get copied to the current working directory
    const targetX86Kit = path.join(targetDir, '.x86-kit');

    let success = true;

    if (sourceX86Kit === targetX86Kit) {
      console.log(pc.yellow('⚠ You are currently inside the x86-kit source directory. Cannot install into itself.'));
      console.log(pc.cyan('Try navigating to a different project directory and running the command again!'));
      return;
    }

    try {
      if (fs.existsSync(sourceX86Kit)) {
        fs.cpSync(sourceX86Kit, targetX86Kit, { recursive: true });
        console.log(pc.green(`✓ Installed .x86-kit → ${targetX86Kit}`));
      } else {
        console.warn(pc.yellow(`⚠ Source .x86-kit not found in package`));
        return;
      }
      
      // Create symlinks
      const targetAgent = path.join(targetDir, '.agent');
      const targetClaude = path.join(targetDir, '.claude');
      
      if (!fs.existsSync(targetAgent)) {
        fs.symlinkSync('.x86-kit', targetAgent, 'dir');
        console.log(pc.green(`✓ Created symlink .agent → .x86-kit`));
      }
      
      if (!fs.existsSync(targetClaude)) {
        fs.symlinkSync('.x86-kit/claude', targetClaude, 'dir');
        console.log(pc.green(`✓ Created symlink .claude → .x86-kit/claude`));
      }
      
      console.log('\n────────────────────────────────────────');
      console.log(pc.bold(pc.green('✔ Installation successful!')));
      console.log('────────────────────────────────────────\n');
      console.log('Happy coding!');
      
    } catch (err) {
      console.error(pc.red(`✗ Error during installation: ${err.message}`));
      success = false;
    }
  });

program
  .command('update')
  .description('Update .agent and .claude folders to the latest version')
  .action(() => {
    console.log(pc.blue('Update functionality coming soon.'));
  });

program
  .command('status')
  .description('Check installation status')
  .action(() => {
    const targetDir = process.cwd();
    const hasAgent = fs.existsSync(path.join(targetDir, '.agent'));
    const hasClaude = fs.existsSync(path.join(targetDir, '.claude'));
    
    console.log('Status:');
    console.log(` .agent : ${hasAgent ? pc.green('Installed') : pc.red('Not Found')}`);
    console.log(` .claude: ${hasClaude ? pc.green('Installed') : pc.red('Not Found')}`);
  });

// Handle invoking without commands to just run init
// Instead of modifying process.argv which can be buggy with Commander,
// we parse arguments. If there are none, we default to showing help or executing init.
if (process.argv.length === 2) {
  process.argv.push('init');
}

program.parse(process.argv);
