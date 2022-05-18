const fs = require("fs");
const path = require("path");
const { stdin, stdout, exit } = require("node:process")

const output = fs.createWriteStream(path.join(__dirname, 'destination.txt'))

stdout.write('Привет! Введите строку или exit для завершения:\n')

stdin.on('data', chunk => {

    if (chunk.toString().trim() === 'exit') {
        exit()
    }

    output.write(chunk);

})


process.on('exit', () => {
    stdout.write('До встречи!')
})
process.on('SIGINT', () => exit())