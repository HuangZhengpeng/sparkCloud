const gulp = require('gulp');
const webp = require('gulp-webp');
const fs=require("fs")

gulp.src("未标题-1.jpg")
.pipe(webp())
.pipe(gulp.dest('webp'))

// let t1="./ani/"
// let t2s=fs.readdirSync(t1)
// t2s.forEach(t2=>{
//     gulp.src(t1+t2)
//     .pipe(webp())
//     .pipe(gulp.dest('disc1'))
// })

// files.forEach(file=>{
//     let path=rootdir+"/"+dir+"/"+file
//     let name=file.split(".")[0]
//     gulp.src(path)
//     .pipe(webp())
//     .pipe(gulp.dest('disc'))
// })