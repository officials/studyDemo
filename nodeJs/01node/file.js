var fs=require("fs");
var data=fs.readFileSync('data.txt'); //readFileSync 同步读取，阻塞式的
console.log(data); //十六进制数据
console.log(data.toString()); //ok

fs.readFile('data.txt',function(err,data){
    if(err){
        console.log(err);
    }
    console.log(data.toString());
})
console.log('程序执行完毕');
//程序执行完毕
//你不是抓到我了吗