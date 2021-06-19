const fs = require("fs")

module.exports=(req,res,paths)=>{
  const s=req.query.s || 1
  const e=req.query.e || 1
  const path=paths["season_"+s].eps[e*1-1]
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
  
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
  
      if (start >= fileSize) {
        //send overflow
        res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
        return 
      }
  
      const chunksize = (end - start)+1
      const file = fs.createReadStream(path, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      //update send
      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      //init send
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  }