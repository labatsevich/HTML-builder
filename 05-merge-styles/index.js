/* eslint-disable indent */
const fs = require('fs/promises');
const path = require('path');
const { stdout } = require('process');

const source = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist', 'bundle.css');

async function createStylesFile(filePath, stylesArr) {

    try {
        await fs.rm(filePath, { force: true });
        await fs.writeFile(filePath, stylesArr.join('\n'));
    } catch (error) {
        stdout.write(error.message);
    }

}

async function mergeStyles(sourceFolder, destFile) {
    let styles = [];
    try {
        const files = await fs.readdir(sourceFolder, { withFileTypes: true });

        for (const file of files) {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const data = await fs.readFile(path.join(sourceFolder, file.name));
                styles.push(data.toString());
            }
        }
        await createStylesFile(destFile, styles);

    } catch (error) {
        stdout.write(error.message);
    }

}

(async() => {
    await mergeStyles(source, dest);
})();