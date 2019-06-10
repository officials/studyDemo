var express = require('express');
var app = new express();
app.use(express.static('public'));
app.get('/index', (req, res, next) => {
    req.data = '123';
    next();

}, function (req, res, next) {
    console.log('通过中间件拿到的数据：' + req.data);
    res.sendFile(__dirname + '/views/index.html');
})
app.route('/add')
.get(function(req,res,next){
    res.send('add');
})
app.listen(3000);