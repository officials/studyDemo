var start = require('./start');
var router = require('./router');
start.start(router.router);
console.log('创建服务成功');