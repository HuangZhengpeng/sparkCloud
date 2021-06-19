const fs=require("fs")

module.exports=(req,res,paths)=>{
    const s=req.query.s || 1
    const e=req.query.e || 1
    // console.log("$",s,e,paths);
    const path=paths["season_"+s].subs[e*1-1]
    if(path){
        fs.readFile(path,(err,file)=>{
            if (err) {
                res.writeHead(404, { "Conten-Type": "text/html;charset=utf-8" })
                res.end(404)
            } else {
                res.writeHead(200, { "Conten-Type": "text/html;charset=utf-8" })
                res.end(file)
            }
        })
    }else{
        res.writeHead(200, { "Conten-Type": "text/plain;charset=utf-8" })
        res.end(null)
    }
    

}