#!/usr/bin/env node

import prompts, { } from "@tmaize/prompts";
import { simpleGit } from 'simple-git';
import * as path from 'path';
import * as fs from 'node:fs';
import { readdir, unlink, readFile, writeFile } from "node:fs/promises";
import { rimraf, rimrafSync, native, nativeSync } from 'rimraf'


const git = simpleGit();
async function downloadRepo(repoUrl: string, targetDirectory: string): Promise<void> {

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
const PACKAGE_JSON_FIELD_NAME = "ancient-love";

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
        await captureDetails(targetRepo);
        try {
            console.log("Removing .git reference...")
            const result = await rimraf(path.join(cwd, "/.git"));
            console.log("\nDone!\n")
            console.log("1. npm install — Install the project dependencies.")
            console.log("2. npm run dev — Run the dev server which will watch changes in src and rebuild into /build")
            console.log("3. npm run love — Preview the latest game build")
        }
        catch (ex) {
            console.error(ex);
        }

    }
    else {
        console.log("Please cd into the directory you want to download and make sure it is empty")
        return;
    }


}

async function captureDetails(repoUrl: string) {
    const latestCommitSha = await git.cwd(cwd).revparse(['HEAD']);

    const forked_from = `${repoUrl.replace('.git', '')}/commit/${latestCommitSha}`;

    const packageJsonPath = path.join(cwd, 'package.json');
    const packageJsonData = await readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonData);
    packageJson[PACKAGE_JSON_FIELD_NAME] = {
        source: repoUrl,
        forked_from: forked_from
    };

    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Updated package.json with ancient-love fields.`);
}


main()
.then(() => {
    process.exit(0);
})
.catch(() => {
    process.exit(1);
});