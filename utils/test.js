const fs = require("fs")

const diskNames = ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
dirPaths=[]
diskNames.forEach(diskName => {
    try {
        fs.accessSync(diskName+':/video', fs.constants.R_OK | fs.constants.W_OK);
        dirPaths.push(diskName+':/video')
    } catch (err) {
        // console.error('无权访问');
    }
})

console.log(dirPaths);