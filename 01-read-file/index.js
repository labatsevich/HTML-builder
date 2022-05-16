const fs = require('fs')
const path = require('path')
const process = require('node:process')

const rs = fs.createReadStream(path.join(__dirname, 'text.txt'));

let str = ''
rs.on('data', (chunk) => {
    str += chunk
})

rs.on('end', () => {
    process.stdout.write(str)
})

rs.on('error', (err) => {
    process.stdout.write(err)
})