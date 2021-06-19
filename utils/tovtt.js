var ass2vtt = require('ass-to-vtt')
var srt2vtt = require('srt-to-vtt')
var fs = require('fs')

let files=fs.readdirSync("./")
files.forEach(file => {
  let index=file.lastIndexOf(".")
  let name=file.slice(0,index)
  let ext=file.slice(index+1,)
  if(ext==="ass"){
    fs.createReadStream(file)
    .pipe(ass2vtt())
    .pipe(fs.createWriteStream(name+'.vtt'))
  }else if(ext==="srt"){
    fs.createReadStream(file)
    .pipe(srt2vtt())
    .pipe(fs.createWriteStream(name+'.vtt'))
  }
  
});

  

