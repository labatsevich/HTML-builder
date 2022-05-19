/* eslint-disable indent */
const fs = require('fs/promises');
const path = require('path');
const { stdout } = require('process');

const source = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');



async function copyDir(source, dest) {

    await fs.rm(dest, { recursive: true, force: true });

    await fs.mkdir(dest, { recursive: true }, (err) => {
        if (err) throw err;
    });

    await fs.readdir(source, { encoding: 'utf-8', withFileTypes: true }).
    then(files =>
        files.forEach(file => {
            fs.copyFile(path.join(source, file.name), path.join(dest, file.name));
        })).
    catch(err => stdout.write(`${err.message}`));

}


copyDir(source, dest);