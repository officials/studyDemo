var http = require('http');
var url=require('url');
function start(router) {
    function onresquest(req,res){
        console.log(url.parse(req.url));
        var routeData=url.parse(req.url);
        res.end(routeData.path);
        router(routeData.path);
    }
    http.createServer(onresquest).listen(3000);
}
exports.start = start;