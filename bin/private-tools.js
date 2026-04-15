const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

/**
 * Registers private engineering commands for the x86-kit.
 * These commands are only available in development environments.
 */
function registerPrivateCommands(program) {
  
  // 📥 INGEST: Absorb new creations from "new/" folder
  program
    .command('ingest')
    .description('Ingest new components from the "new" folder into the core kit (Private)')
    .action(() => {
      const targetDir = process.cwd();
      const sourceNew = path.join(targetDir, 'new');
      const destKit = path.join(targetDir, '.x86-kit');

      if (!fs.existsSync(sourceNew)) {
        console.log(pc.yellow('⚠ "new" folder not found. Nothing to ingest.'));
        return;
      }

      const categories = ['agents', 'skills', 'workflows', 'rules', 'scripts'];
      let addedCount = 0;

      categories.forEach(category => {
        const srcCat = path.join(sourceNew, category);
        const destCat = path.join(destKit, category);

        if (fs.existsSync(srcCat)) {
          if (!fs.existsSync(destCat)) {
            fs.mkdirSync(destCat, { recursive: true });
          }

          const items = fs.readdirSync(srcCat);
          items.forEach(item => {
            const srcItem = path.join(srcCat, item);
            const destItem = path.join(destCat, item);

            if (!fs.existsSync(destItem)) {
              fs.cpSync(srcItem, destItem, { recursive: true });
              console.log(pc.green(`✓ Absorbed ${category}/${item}`));
              addedCount++;
            }
          });
        }
      });

      if (addedCount === 0) {
        console.log(pc.cyan('No new items found to ingest. All items in "new" folder already exist in the kit.'));
      } else {
        console.log(pc.bold(pc.green(`\n✔ Ingestion complete! ${addedCount} new items added to the kit.`)));
      }
    });

  // 🚀 DEPLOY: Private Sync (Git + Link)
  program
    .command('deploy')
    .description('Sync the brain to GitHub and refresh local link (Private)')
    .action(() => {
      console.log(pc.cyan('🚀 Starting Private Sync...'));
      try {
        console.log(pc.blue('  - Committing changes...'));
        const timestamp = new Date().toLocaleString();
        execSync('git add .', { stdio: 'inherit' });
        try {
          execSync(`git commit -m "Auto-sync: ${timestamp}"`, { stdio: 'inherit' });
        } catch (e) {
          console.log(pc.yellow('  - No changes to commit.'));
        }

        console.log(pc.blue('  - Pushing to GitHub...'));
        execSync('git push', { stdio: 'inherit' });

        console.log(pc.blue('  - Refreshing local link...'));
        execSync('npm link', { stdio: 'inherit' });

        console.log(pc.bold(pc.green('\n✔ Private Sync complete! Brain is now in the cloud and locked locally.')));
      } catch (err) {
        console.error(pc.red(`✗ Sync failed: ${err.message}`));
      }
    });

  // 🚢 SHIP: Public release to npm
  program
    .command('ship')
    .description('Release new agents to public npm registry (Private)')
    .requiredOption('--otp <otp>', 'One-time password for npm 2FA')
    .action((options) => {
      console.log(pc.magenta('🚢 Preparing Public Release to npm...'));
      try {
        console.log(pc.blue('  - Bumping version (patch)...'));
        execSync('npm version patch', { stdio: 'inherit' });

        console.log(pc.blue('  - Publishing to npm...'));
        execSync(`npm publish --access public --otp=${options.otp}`, { stdio: 'inherit' });

        console.log(pc.blue('  - Syncing tags to GitHub...'));
        execSync('git push --follow-tags', { stdio: 'inherit' });

        console.log(pc.bold(pc.magenta('\n✔ Public Launch Successful! Agents are live on npm.')));
      } catch (err) {
        console.error(pc.red(`✗ Release failed: ${err.message}`));
      }
    });
}

module.exports = { registerPrivateCommands };
