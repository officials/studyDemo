//1.引入events对象，创建eventEmitter对象
var event=require('events');
var emitter=new event.EventEmitter();
//事件处理函数

var connctHandler=function connected(){
    console.log('connected被调用了');
}
emitter.on('eventName',connctHandler);
//触发事件
emitter.emit('eventName');
console.log('程序执行完毕');