/* eslint-disable indent */
//const { constants } = require('fs');
const { createReadStream, createWriteStream } = require('fs');
const fs = require('fs/promises');
const path = require('path');
const { stdout } = require('process');

const PROJECT = path.join(__dirname, 'project-dist');
const ASSETS = path.join(PROJECT, 'assets');
const COMPONENTS = path.join(__dirname, 'components');


async function mergeStyles(srcFolder, destFolder, toFileStyles) {

    try {
        const files = await fs.readdir(srcFolder, { withFileTypes: true }),
            ws = createWriteStream(path.join(destFolder, toFileStyles));

        files.forEach(async(file) => {
            if (file.isFile() && file.name.endsWith('.css')) {
                const rs = createReadStream(path.join(srcFolder, file.name), 'utf-8');
                rs.pipe(ws, { end: true });
            }
        });

    } catch (error) {
        stdout.write(`\nError:${error}`);
    }

}

async function mergeComponentsTemplate() {
    try {
        let template = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');

        const components = await fs.readdir(COMPONENTS);

        for (const component of components) {

            if (component.endsWith('.html')) {
                const componentName = component.slice(0, -5);
                const componentBody = await fs.readFile(path.join(COMPONENTS, component), 'utf-8');
                template = template.replace(`{{${componentName}}}`, componentBody);
            }
        }

        await fs.writeFile(path.join(PROJECT, 'index.html'), template);

    } catch (error) {
        stdout.write(`\nError:${error}`);
    }
}

async function copyAssets(source, dest) {

    try {
        await fs.rm(dest, { force: true, recursive: true });
        await fs.mkdir(dest, { recursive: true });
        await fs.readdir(source, { encoding: 'utf-8', withFileTypes: true }).
        then(dirents =>
            dirents.forEach(dirent => {
                if (dirent.isDirectory()) {
                    fs.mkdir(path.join(dest, dirent.name), { recursive: true });
                    copyAssets(path.join(source, dirent.name), path.join(dest, dirent.name));
                } else {
                    fs.copyFile(path.join(source, dirent.name), path.join(dest, dirent.name));
                }
            })).
        catch(error => stdout.write(`\nError:${error}`));

    } catch (error) {
        stdout.write(`\nError:${error}`);
    }


}

async function build() {
    try {

        await mergeComponentsTemplate();
        await mergeStyles(path.join(__dirname, 'styles'), PROJECT, 'style.css');
        await copyAssets(path.join(__dirname, 'assets'), ASSETS);

    } catch (error) {
        stdout.write(`\nError:${error}}`);
    }


}


(async() => {

    fs.mkdir(PROJECT, { recursive: true });
    await build();

})();