#!/usr/bin/env node

import { Command } from 'commander';
import prompt from 'prompt';
import {execa} from 'execa';

const { $ } = execa;

const program = new Command();

program
  .version('1.0.0')
  .description('GitHub Repo Setup CLI');

program
  .command('setup')
  .description('Setup GitHub Repo')
  .action(() => {
    prompt.start();

    const schema = {
      properties: {
        repo_url: {
          description: 'Enter GitHub repo URL:',
          required: true
        }
      }
    };

    prompt.get(schema, async (err, result) => {
      if (err) {
        console.error('Error during prompt:', err);
        process.exit(1);
      }

      const { repo_url } = result;

      try {
        await setupGitHubRepo(repo_url);
      } catch (error) {
        console.error('Error during GitHub repo setup:', error);
        process.exit(1);
      }
    });
  });

program.parse(process.argv);

async function setupGitHubRepo(repo_url) {
  const repo_name = repo_url.match(/movableink-clients\/([^/]+)\/.*/)?.[1];
  const app_name = repo_url.match(/.*\/apps\/([^/]+)$/)?.[1];

  const executeCommand = async (command, args) => {
    const { stdout, stderr } = await execa(command, args);
    if (stderr) {
      throw new Error(stderr.stderr);
    }
    return stdout;
  };

  await executeCommand('git', ['checkout', 'master']);
}
