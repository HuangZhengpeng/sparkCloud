const express = require("express")
// const morgan=require("morgan")
const routers=require("./routers")
const path = require('path');

//端口号
const port=8000
const app=express()
app.use(express.urlencoded({extended:false}))//配置body模块。为了给req增加body，得到post传值
app.use(express.json())//将数据转换为json。为了给req增加body，得到post传值。
// app.use(morgan("short"))//logger本地记录访问信息

//判断是什么端的请求并返回入口文件
app.get("/",(req,res, next)=>{
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID){
        res.sendFile(path.join(__dirname, './public/mobile', 'index.html'));
    }else{
        res.sendFile(path.join(__dirname, './public/pc', 'index.html'));
    }
        
})

// 添加静态资源
app.use(express.static("./public/pc"))
app.use(express.static("./public/mobile"))
app.use(express.static("./public/imgs"))

// http://localhost:8000/video/list?tag=All&page=1&limit=30&type=Movies
app.get("/video/list",routers.getVideoList_route)

//http://localhost/:8000/video/getvideo?id=6098c656834ad34970957142&s=1&e=1&type=Movies
app.get("/video/getvideo",routers.getVideo_route)

//http://localhost:8000/video/getsubs?id=6098c656834ad34970957142&s=1&e=1&type=Movies
app.get("/video/getsubs",routers.getSubs_route)

//http://localhost:8000/video/search?keywords=X&type=Movies
app.get("/video/search",routers.queryVideos_route)

// app.post("/login",routers.login_route)

//post 
//http://localhost:8000/createfile
//data:type,dir
app.post("/createfile",routers.uploader,routers.createFile_route)

//http://localhost:8000/createdir?name=&dir=
app.get("/createdir",routers.createDir_route)

//http://localhost:8000/getfiles?dir=
app.get("/getfiles",routers.getFiles_route)

//http://localhost:8000/movefile
//ids=&dir=&newdir=
app.post("/movefile",routers.moveFile_route)

//删除的时候移动到RecycleBin里
//http://localhost:8000/deletefile
//ids=&dir=
app.post("/deletefile",routers.deleteFile_route)

//http://localhost:8000/recoverfile
//ids=
app.post("/recoverfile",routers.recoverFile_route)

//http://localhost:8000/downloadfile?id=&dir=
app.get("/downloadfile",routers.downLoadFile_route)

//http://localhost:8000/clearfile
//ids=
app.post("/clearfile",routers.clearFile_route)

//http://localhost:8000/clearall
app.get("/clearall",routers.clearAll_route)

//对于没有的路径，返回入口文件
app.use((req,res, next)=>{
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID){
        res.sendFile(path.join(__dirname, './public/mobile', 'index.html'));
    }else{
        res.sendFile(path.join(__dirname, './public/pc', 'index.html'));
    }       
})

app.listen(port,()=>{
    console.log(`服务开启,http://localhost:${port}`);

})
// }