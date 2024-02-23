#!/usr/bin/env node

import { Command } from 'commander';
import prompt from 'prompt';
import {execa} from 'execa';
import {access, constants } from 'node:fs';
import { chdir, cwd } from 'node:process';


import path from 'path';
import fs from 'fs';



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

  console.log('repo name', repo_name)
  console.log('repo url', repo_url)


  const repoExists = checkRepository(repo_name);

    if (repoExists) {
        try {
          chdir(`${repo_name}`);
          console.log(`New directory: ${cwd()}`);
        } catch (err) {
          console.error(`chdir: ${err}`);
        }
    }
}

const checkRepository = async (folderName) => {
    const directoryPath = path.join(process.cwd(), folderName);
    
    console.log('${__dirname}', path.resolve());

    access(directoryPath, constants.F_OK, (err) => {
        console.log(`${err ? `${folderName} does not exist cloning repo` : `Changing directory into ${directoryPath}`}`);

        if (err) {
            console.log('cloning repo #todo');
        }
      });


    console.log('access', );
}

// const executeCommand = async (command, args) => {
//     console.log('here in execute command');
//     const { stdout, stderr } = await execa(command, args);
//     if (stderr) {
//       throw new Error(stderr.stderr);
//     }
//     return stdout;
//   };


/*

example path:

movableink-clients/test_repo/

*/