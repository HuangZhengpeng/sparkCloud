// const { exec, execSync } = require("child_process")
// let cmd = `ffmpeg -i \"${pathheader+episode}\" \"${pathheader+name}.vtt\"`
// execSync(cmd)
// const { randomInt } = require("crypto")//可以产生随机数
const fs = require("fs")
var ass2vtt = require('ass-to-vtt')
var srt2vtt = require('srt-to-vtt')
const database = require("../database")

const allTags =require("../allTags")
let steps=0//记录完成的数据库异步操作

//写每一条数据document
function packeps(pathheader,episodes){
    let eps=[]
    let subs=[]
    episodes.forEach(episode=>{
        let index1=episode.lastIndexOf(".")
        let index2=episode.length
        let name=episode.substring(0,index1)
        let ext=episode.substring(index1+1,index2)
        if(ext==="mp4" || ext==="m4v"){
            eps.push(pathheader+name+"."+ext)
        }else if(ext==="ass"){
            if(!fs.existsSync(pathheader+name+".vtt")){
                fs.createReadStream(pathheader+name+'.ass')
                .pipe(ass2vtt())
                .pipe(fs.createWriteStream(pathheader+name+'.vtt'))
            }
            subs.push(pathheader+name+".vtt")
        }else if(ext==="srt"){
            if(!fs.existsSync(pathheader+name+".vtt")){
                fs.createReadStream(pathheader+name+'.srt')
                .pipe(srt2vtt())
                .pipe(fs.createWriteStream(pathheader+name+'.vtt'))
            }
            subs.push(pathheader+name+".vtt")
        }else if(ext==="vtt"){
            if(!fs.existsSync(pathheader+name+".ass") && !fs.existsSync(pathheader+name+".srt")){
                subs.push(pathheader+name+".vtt")
            }
            
        }else if(ext!=="vtt"){
            console.log("存在多余文件的目录",pathheader);
        }
    })
    return {eps,subs}

}

//把数据写入数据库
function writeDb(video_by_tag,rootDir,type,videoTags,videoTagsR){
    const model = video_by_tag["All"+type]
    //database.mModel("mediadb", "All"+type)
    let BUNDLES=[]
    let bundles=fs.readdirSync(rootDir)
    bundles.forEach(bundle => {
        bundleName=bundle.split("]")[0].slice(1,)
        // console.log(bundleName);
        let matchresult=bundle.match(/\{.*\}/g)
        let tags=[]
        if(matchresult){
            tags=matchresult[0].slice(1,-1).split("}{").map(tagCN=>{
                if(videoTagsR[tagCN]){
                    return videoTagsR[tagCN]
                }else{
                    console.log(`${bundle}的分类中不该有${tagCN}标签`);
                }
            })
        }
        let seasons= fs.readdirSync(rootDir + bundle)
        let paths={}
        let bundleSize={}
        seasons.forEach(season => {
            if (!isNaN(Number(season))) {
                let episodes=fs.readdirSync(rootDir + bundle + "/" + season)
                paths[`season_${season}`]=packeps(rootDir + bundle + "/" + season+"/",episodes)
                bundleSize[`season_${season}`]=paths[`season_${season}`].eps.length
            }
        })
        BUNDLES.push({
            bundleName,
            paths,
            tags,
            type,
            bundleSize,
        })
        
    })
    // console.log(BUNDLES);
    model.create(BUNDLES,err=>{
        steps++
        if(!err){
            videoTags.forEach(videoTag=>{
                model.find({tags:{$in:videoTag}},"bundleName tags bundleSize type",(err,files)=>{
                    let filesObj=files.map(file=>file.toObject());
                    let SortModel = video_by_tag[videoTag+type]
                    //database.mModel("mediadb", videoTag+type)
                    SortModel.create(filesObj,err=>{
                        steps++
                    })
                })
            
            })
        }
    })
    

}
function scanDisc(dirPaths=[]){
    const {movieTags, animationTags, tvTags, movieTagsCN, animationTagsCN, tvTagsCN}=allTags
    let movieTagsR={}
    movieTags.forEach(movieTag=>{
        let Rkey=movieTagsCN[movieTag]
        movieTagsR[Rkey]=movieTag
    })
    let animationTagsR={}
    animationTags.forEach(animationTag=>{
        let Rkey=animationTagsCN[animationTag]
        animationTagsR[Rkey]=animationTag
    })
    let tvTagsR={}
    tvTags.forEach(tvTag=>{
        let Rkey=tvTagsCN[tvTag]
        tvTagsR[Rkey]=tvTag
    })

    const video_by_tag={}
    movieTags.forEach(movieTag=>{
        video_by_tag[movieTag+"Movies"]=database.mModel("mediadb",movieTag+"Movies")
    })
    video_by_tag["AllMovies"]=database.mModel("mediadb","AllMovies")

    animationTags.forEach(animationTag=>{
        video_by_tag[animationTag+"Animations"]=database.mModel("mediadb",animationTag+"Animations")
    })
    video_by_tag["AllAnimations"]=database.mModel("mediadb","AllAnimations")

    tvTags.forEach(tvTag=>{
        video_by_tag[tvTag+"Tvs"]=database.mModel("mediadb",tvTag+"Tvs")
    })
    video_by_tag["AllTvs"]=database.mModel("mediadb","AllTvs")
    
    if(dirPaths.length===0){
        // //删除旧的数据库
        // Object.keys(video_by_tag).forEach(key=>{
        //     video_by_tag[key].deleteMany({})
        // })
        const diskNames = ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        diskNames.forEach(diskName => {
            try {
                fs.accessSync(diskName+":/video/", fs.constants.R_OK | fs.constants.W_OK);
                dirPaths.push(diskName+":/video/")
            } catch (err) {
                // console.error('无权访问');
            }
        })
    }
    let allSteps=dirPaths.length*(3+movieTags.length+animationTags.length+tvTags.length)
    let interval=setInterval(()=>{
        console.log(`共有：${allSteps}，已完成：${steps}`);
        if(steps===allSteps){
            const dbs=["mediadb", "filedb"]
            dbs.forEach(db=>{
                database.disconnect(db)
            })
            clearInterval(interval)
        }
    },1000)
    if (dirPaths.length>0){
        let vlist=[]
        Object.keys(video_by_tag).forEach(key=>{
            vlist.push(video_by_tag[key].deleteMany({}))
        })
        // let writeList=[]
        Promise.all(vlist).then(()=>{
            dirPaths.forEach(dirPath=>{
                // writeList.push()
                writeDb(video_by_tag, dirPath+"movie/","Movies",movieTags,movieTagsR)
                writeDb(video_by_tag, dirPath+"animation/","Animations",animationTags,animationTagsR)
                writeDb(video_by_tag, dirPath+"tv/","Tvs",tvTags,tvTagsR)
            })
        })
        // Promise.all(writeList).then(()=>{
        //     database.disconnect()
        // })
    }


}

scanDisc()