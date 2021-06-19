const schemas=require("./schemas")
const mongoose=require("mongoose")
const ip="localhost/"
const dbs=["mediadb", "filedb"]
let dbObj={}
dbs.forEach(db=>{
    dbObj[db]=mongoose.createConnection("mongodb://"+ip+db,{ autoIndex: false, useNewUrlParser: true, useUnifiedTopology: true })//
})

// mongoose.connection.once("open",()=>{
//     console.log("连接成功");
// })
// mongoose.connection.once("close",()=>{
//     console.log("关闭成功");
// })
exports. mModel=(db,modelName)=>{
    var mySchema=new mongoose.Schema(schemas.vSchema(modelName))
    Model=dbObj[db].model(modelName,mySchema);
    return Model
}
exports. fModel=(db,modelName)=>{
    var mySchema=new mongoose.Schema(schemas.fSchema())
    Model=dbObj[db].model(modelName,mySchema);
    return Model
}
exports.disconnect=(db)=>{
    dbObj[db].close()
    //disconnect()
}