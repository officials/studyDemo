let http=require('http');
http.createServer(function(req,res){
    res.writeHead(200,{"Content-Type":"text/plan"});
    res.end("hello word");
    console.log('server is running localhost:3000');
}).listen(3000);