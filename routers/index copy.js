const multer = require("multer")
const fs=require("fs")
// const path = require('path');
const database = require("../database")
// const express = require("express")
const controller = require("../controller")

const allTags = require("../allTags")


//注意多了一个All的分类
let { movieTags, animationTags, tvTags } = allTags
movieTags.unshift("All")
animationTags.unshift("All")
tvTags.unshift("All")

const video_by_tag = {}
movieTags.forEach(movieTag => {
  video_by_tag[movieTag + "Movies"] = database.mModel("mediadb", movieTag + "Movies")
})
animationTags.forEach(animationTag => {
  video_by_tag[animationTag + "Animations"] = database.mModel("mediadb", animationTag + "Animations")
})
tvTags.forEach(tvTag => {
  video_by_tag[tvTag + "Tvs"] = database.mModel("mediadb", tvTag + "Tvs")
})

const FileModels={}
FileModels["File0"]=database.fModel("filedb", "File0")

//删除的时候移动到recycleBin里
FileModels["RecycleBin"]=database.fModel("filedb", "RecycleBin")

let maxdir=0
//递归连接collection/model
function connectFileModels(oneModel){
  oneModel.find({type:"dir"},(err, files)=>{
    files.forEach(file=>{
      let modelName=file.modelName
      let dirnum=parseInt(modelName.slice(4,))
      if(dirnum>maxdir){
        maxdir=dirnum
      }
      FileModels[modelName]=database.fModel("filedb", modelName)
      connectFileModels(FileModels[modelName])
    })
  
  })
}
connectFileModels(FileModels["File0"])

// console.log(fileModel);

exports.getVideoList_route = (req, res) => {
  const type = req.query.type
  const tag = req.query.tag
  const page = req.query.page * 1
  const limit = req.query.limit * 1
  video_by_tag[tag + type].find({}, "bundleName bundleSize type", { limit, skip: (page - 1) * limit }, controller.sendList(res))
}

exports.queryVideos_route = (req, res) => {
  const type = req.query.type
  const keywords = req.query.keywords
  if (type) {
    video_by_tag["All" + type].find({ "bundleName": { $regex: keywords } }, "bundleName bundleSize type", controller.sendList(res))
  } else {
    let MoviesSearch = video_by_tag["AllMovies"].find({ "bundleName": { $regex: keywords } }, "bundleName bundleSize type")
    let AnimationsSearch = video_by_tag["AllAnimations"].find({ "bundleName": { $regex: keywords } }, "bundleName bundleSize type")
    let TvsSearch = video_by_tag["AllTvs"].find({ "bundleName": { $regex: keywords } }, "bundleName bundleSize type")
    Promise.all([MoviesSearch, AnimationsSearch, TvsSearch]).then(searchRes => {
      let result = [...searchRes[0], ...searchRes[1], ...searchRes[2]]
      res.writeHead(200, { "Conten-Type": "application/json;charset=utf-8" })
      const list = result.map(file => file.toObject())
      res.end(JSON.stringify(list))
    })
  }
}

// exports.getInfo_route=(req, res)=>{
//   const type=req.query.type
//   video_by_tag["All"+type].findOne({ _id: req.query.id }, (err, doc) => {
//     if( !doc || err){
//       res.writeHead(404, {"Content-Type":"text/html;charset=utf-8"})
//       res.end("出错了~~~")
//       return
//     }else{
//       controller.sendVideo(req,res,doc.paths)
//     }

//   })
// }

exports.getVideo_route = (req, res) => {
  const type = req.query.type
  video_by_tag["All" + type].findOne({ _id: req.query.id }, (err, doc) => {
    if (!doc || err) {
      res.writeHead(404, { "Content-Type": "text/html;charset=utf-8" })
      res.end("出错了~~~")
      return
    } else {
      controller.sendVideo(req, res, doc.paths)
    }

  })
}

exports.getSubs_route = (req, res) => {
  const type = req.query.type
  video_by_tag["All" + type].findOne({ _id: req.query.id }, (err, doc) => {
    if (!doc || err) {
      res.writeHead(404, { "Content-Type": "text/html;charset=utf-8" })
      res.end("出错了~~~")
      return
    } else {
      controller.sendSubs(req, res, doc.paths)
    }

  })
}

exports.login_route = (req, res) => {
  console.log(req.body);
  res.send("LOGIN")
}

let disk=null
const diskNames = [ "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "C",]
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.body.type==="file"){
      disk=req.body.disk
      if(!disk || !fs.existsSync(disk+":/file")){
        let index=diskNames.findIndex(item=>{
          try{
            fs.accessSync(item+":/file/")
            return true
          }catch (err) {
            return false
          }

        })
        disk=diskNames[index]
      }
      cb(null, disk+":/file/")
    }
    // cb(null, "D:/file/")

  },
  filename: function (req, file, cb) {
    // console.log("filename", req.body);
    cb(null, file.originalname)
  }
})

exports.uploader = multer({
  storage,
  //path.join(__dirname,"./downLoads")
}).single('FILE')

exports.createFile_route=(req,res)=>{
  let name=req.file.originalname
  let realPath=disk+":/file/"+name
  let {dir}=req.body
  type="file"
  FileModels[dir].create({
    name,
    realPath,
    type,
    dir,
  })
  res.send("finished")
}
// exports.deleteFile=(req,res)=>{
//   let realPath=req.query.realPath
//   res.send("finished")
// }

exports.createDir_route=(req,res)=>{
  maxdir++
  let modelName="File"+maxdir
  let {name, dir}=req.query
  let type="dir"
  let doc={
    name,
    type,
    dir,
    modelName,
  }
  FileModels[dir].create(doc,(err)=>{
    if(err){
      res.send("failed")
    }else{
      FileModels[modelName]=database.fModel("filedb", modelName)
      //需要传回modelName，其他信息顺便
      res.writeHead(200, { "Conten-Type": "application/json;charset=utf-8" })
      res.end(JSON.stringify(doc))
    }
  })
}

exports.getFiles_route=(req,res)=>{
  let modelName="File0"
  if(req.query.dir){
    modelName=req.query.dir
  }
  FileModels[modelName].find({},controller.sendList(res))
}

function coremove(_id, dir, newdir, res){
  FileModels[dir].findOne({_id},(err,file)=>{
    let fileObj=file.toObject()
    if(newdir!=="RecycleBin"){
      fileObj.dir=newdir
    }
    FileModels[newdir].create(fileObj,(err)=>{
      FileModels[dir].deleteOne({_id},(err)=>{
        res.send("finished")
      })
    })
  })
}

exports.moveFile_route=(req,res)=>{
  const { id:_id, dir, newdir }=req.query
  coremove(_id, dir, newdir, res)
}

exports.deleteFile_route=(req,res)=>{
  const { id:_id, dir }=req.query
  let newdir="RecycleBin"
  coremove(_id, dir, newdir, res)
}
exports.recoverFile_route=(req,res)=>{
  const { id:_id }=req.query
  let dir="RecycleBin"
  FileModels[dir].findOne({_id},(err,file)=>{
    let newdir=file.dir
    coremove(_id, dir, newdir, res)
  })
}