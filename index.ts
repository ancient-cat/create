#!/usr/bin/env node

import prompts, { } from "@tmaize/prompts";
import { simpleGit } from 'simple-git';
import * as path from 'path';
import * as fs from 'node:fs';
import { readdir, unlink } from "node:fs/promises";
import { rimraf, rimrafSync, native, nativeSync } from 'rimraf'


async function downloadRepo(repoUrl: string, targetDirectory: string): Promise<void> {
    const git = simpleGit();

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
    }

    try {
        await git.clone(repoUrl, targetDirectory);
        console.log(`Repository cloned into ${targetDirectory}`);
    } catch (error) {
        console.error('Failed to clone repository:', error);
    }
}

const cwd = process.cwd();

console.log(`Welcome! This util will create an ancient-love project for you.`);
console.log("Ancient Love: https://github.com/ancient-cat/ancient-love");

async function main() {

    const targetRepo: string = "https://github.com/ancient-cat/ancient-love";
    

    const result: { proceed: boolean; } = await prompts({
        type:"confirm",
        message: `Create project in current directory? (${cwd})`,
        name: "proceed",
        initial: true,
    });

    if (result.proceed) {

        console.log(`Cloning "${targetRepo}" into "${cwd}"...`);
        await downloadRepo(targetRepo, cwd)
        try {
            console.log("Removing .git reference...")
            const result = await rimraf(path.join(cwd, "/.git"));
            console.log("\nDone!\n")
            console.log("1. npm install — Install the project dependencies.")
            console.log("2. npm run dev — Run a dev server")
            console.log("3. npm run love — Preview a the latest game build")
        }
        catch (ex) {
            console.error(ex);
        }

    }
    else {
        console.log("Please cd into the directory you want to download and make sure it is empty")
        return;
        // todo
        // await prompts({
        //     name: "target_directory",
        //     type: "autocompleteMultiselect",
        //     message: "Where do you want to create the project?",
        //     choices: [
        //         {
        //             title: "Current Directory",
        //             description: ".",
        //             selected: true,
        //             value: "."
        //         },
        //         {
    
        //         }
        //     ]
            
        // })

    }


}


main()
.then(() => {
    process.exit(0);
})
.catch(() => {
    process.exit(1);
});