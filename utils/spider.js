const fs=require("fs")
const request = require("request");


const rootdir="../public/imgs"
const dirs=fs.readdirSync(rootdir)

let dir=dirs[1]
let files= fs.readdirSync(rootdir+"/"+dir)
let names= files.map(path=>{
    return path.split(".")[0]
})



// let a=fs.openSync("./0.txt","w+")
// // console.log(a);
// for(let i=0;i<names.length;i++){
//     fs.writeSync(a,names[i]+"\n")
// }
// fs.closeSync(a)
function saveimg(url, savepath){
    // let process=fs.createWriteStream(savepath)
    const process = fs.createWriteStream(savepath);
    request({
      url,
      timeout: 10000
    }).pipe(process);
}
const Crawler = require('crawler');

const c = new Crawler({
    maxConnections: 10,
    rateLimit: 2000, // `maxConnections` will be forced to 1
    // This will be called for each crawled page
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            console.log((res));
            // let list=JSON.parse(res.body)
            // // console.log(list);
            // if(list.length>0){
            //     let i=0
            //     let triger=true
            //     let ext=list[0].img.slice(list[0].img.lastIndexOf(".")).trim()
            //     while (i<list.length && triger) {
            //         // console.log(list[i].title.trim(),res.options.name);
            //         if(list[i].title.trim()===res.options.name){
            //             let url=list[i].img
            //             saveimg(url, `./imgs/${dir}/${res.options.name+ext}`)
            //             triger=false
            //         }
            //         i++
            //     }
            //     if(triger){
            //         saveimg(list[0].img, `./imgs/${dir}/${res.options.name+ext}`)//"./imgs/"+dir+"/"+res.options.name
            //         console.log(res.options.name+"不完全匹配");
            //     }
            // }else{
            //     console.log(res.options.name+"不能匹配!!!");
            // }
        }
        done();
    }
});

// c.queue({
//     uri:`https://search.douban.com/movie/subject_search?search_text=${encodeURIComponent("进击的巨人")}&cat=1002`,
//     name:"进击的巨人"
// })

// names.forEach(name=>{
//     c.queue({
//         uri:"https://movie.douban.com/j/subject_suggest?q="+encodeURIComponent(name),
//         name
//     })
// })
    



// dirs.forEach(dir=>{
//     // fs.mkdirSync("./imgs/"+dir)
//     let files= fs.readdirSync(rootdir+"/"+dir)
//     let names= files.map(path=>{
//         return path.split(".")[0]
//     })
//     getPics(names,"./imgs/"+dir)
// })

