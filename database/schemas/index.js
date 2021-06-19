exports.vSchema=(modelName)=>{
    if(modelName.slice(0,3)==="All"){
        return require("./video_all")
    }else{
        return require("./video_tag")
    }
}

exports.fSchema=()=>{
    return require("./file")
}