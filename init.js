#!/usr.bin/env node
// File: init.js
import { Command } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { read } from 'fs';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout

});


//Command
const init = new Command()
    .name('init')
    .description('Initialize shadcn-custom package')
    .action(async () => {
        console.log('Initializing shadcn-custom package...');

        //Copying components
        console.log('Copying components...');
        const sourceDir = path.join(__dirname, 'src');
        const destDir = path.join(process.cwd(), 'src');
        const files = await fs.readdir(sourceDir);
        for (const file of files) {
            if (file !== 'stories') {
                const sourceFile = path.join(sourceDir, file);
                const destFile = path.join(destDir, file);
                if (await fs.pathExists(destFile)) {
                    const answer = await new Promise((resolve) => {
                        rl.question(`File ${destFile} already exists. Overwrite? (y/n) `, resolve);
                    });
                    if (answer.toLowerCase() !== 'y') {
                        continue;
                    }
                    await fs.copy(sourceFile, destFile);
                }
            }
        }

        //Install dependencies
        console.log('Installing dependencies...');
        const packageJson = await fs.readFile(path.join(__dirname, 'package.json'), 'utf8');
        const packageData = JSON.parse(packageJson);
        const dependencies = Object.keys(packageData.dependencies)
            .filter(dep => !['autoprefixer', 'postcss'].includes(dep))
            .join(' ');
        execSync(`npm install ${dependencies}`, { stdio: 'inherit' });
        console.log('shadcn-custom installed!');
        rl.close();
    });
init.parse(process.argv);
