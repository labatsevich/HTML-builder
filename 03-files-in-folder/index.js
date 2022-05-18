const { stdout } = require('process')
const { readdir } = require('fs/promises')
const path = require('path');
const { stat } = require('fs');



async function scanFolder(folder) {
    try {
        const files = await readdir(folder, { withFileTypes: true });
        for (const entry of files) {
            if (entry.isFile()) {
                stat(path.join(folder, entry.name), (err, stats) => {
                    const { name, ext } = path.parse(entry.name)
                    const size = stats.size / 1000

                    stdout.write(`${name} - ${ext.slice(1)} - ${Math.ceil(size)}kb\n`)
                })
            }
        }
    } catch (err) {
        stdout.write(err)
    }
}

scanFolder(path.join(__dirname, 'secret-folder'))