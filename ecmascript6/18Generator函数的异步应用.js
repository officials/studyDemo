/**
 * 在es6以前，异步编程大概有下面4种
 * 1.回调函数
 * 2.事件监听
 * 3.发布、订阅
 * 4.Promise对象
 */

/**
 * 回调函数
 * 读取文件进行处理，是这样写的
 */
fs.readFile('./config.json', 'utf-8', function (err, data) {
    if (err) throw err;
    console.log(data);
})
//上面代码中，第三个参数就是回调函数

/**
 * Promise
 */
var readFile = require('fs-readfile-promise');
readFile(fileA)
    .then(function (data) {
        console.log(data.toString());
    })
    .then(function () {
        return readFile(fileB);
    })
    .then(function (data) {
        console.log(data.toString());
    })
    .catch(function (err) {
        console.log(err);
    });

/**
 * Generator函数
 */
function* asyncJob() {
    // ...其他代码
    var f = yield readFile(fileA);
    // ...其他代码
}

/**
 * 协程的Generator函数实现
 * 整个Generator函数就是一个封装的异步任务，异步操作需要暂停的
 * 地方，都用yield语句表明
 */
function* gen(x) {
    var y = yield x + 2;
    return y;
}
var g = gen();
g.next(); //{value:3,done:false}
g.next(); //{value:undefined,done:true}

/**
 * Generator 函数的数据交换和错误处理 
 * next返回值的 value 属性，是 Generator 函数向外输出数据；
 * next方法还可以接受参数，向 Generator 函数体内输入数据。
 */
function* gen(x) {
    var y = yield x + 2;
    return y;
}
var g = gen(1);
g.next() // { value: 3, done: false }
g.next(2) // { value: 2, done: true }
//Generator函数内部还可以部署错误处理代码，捕获函数体外抛出的错误
function* gen(x) {
    try {
        var y = yield x + 2;
    } catch (e) {
        console.log(e);
    }
    return y;
}
var g = gen(1);
g.next(); //{value:3,done:false}
g.throw('error');
//'error'

/**
 * 异步任务的封装
 */
var fetch = require('node-fetch');
function* gen() {
    var url = 'https://api.github.com/users/github';
    var result = yield fetch(url);
    console.log(result.bio);
}
//下面执行上面的代码
var g = gen();
var result = g.next();
result.value.then(function (data) {
    return data.json();
}).then(function (data) {
    g.next(data);
});

/**
 * Thunk函数
 * Thunk函数式自执行Generator函数的一种方法
 */
var x = 1;
function f(m) {
    return m * 2;
}
f(x + 5);  //12

/**
 * Thunk函数的意义
 * 编译器的“传名调用”实现，往往是将参数放到一个临时的函数中，再将这个函数
 * 传入函数体，这个临时函数就叫做Thunk函数
 */
function f(m) {
    return m * 2;
}
f(x + 5);
//等用于
var thunk = function () {
    return x + 5;
}
function f(thunk) {
    return thunk() * 2;
}
//在上面的代码中，thunk就是Thunk函数

/**
 * javascript语言和Thunk函数
 * JavaScript语言是传值调用，它的thunk函数含义有所不同，在JavaScript语言中
 * Thunk函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数
 * 作为参数的单参数函数
 */
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);
// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
    return function (callback) {
        return fs.readFile(fileName, callback);
    };
};
var readFileThunk = Thunk(fileName);
readFileThunk(callback);

/**
 * 任何函数，只要参数有回调函数，就能写成Thunk函数的形式
 */
const Thunk = function (fn) {
    return function (...args) {
        return function (callback) {
            return fn.call(this, ...args, callback);
        }
    };
};
var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);

/**
 * Thunkify模块
 * 生产环境的转换器，建议使用Thunkify模块
 */

/**
 * Generator函数的流程管理
 */
//Generator函数可以自动执行
function* gen() { }
var g = gen();
var res = g.next();
while (!res.done) {
    console.log(res.value);
    res = g.next();
}

/**
 * 如果必须保证前一步操作完成，才能执行后一步，上面的代码就不可行
 */
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);
var gen = function* () {
    var r1 = yield readFileThunk('/etc/fstab');
    console.log(r1.toString());
    var r2 = yield readFileThunk('/etc/shells');
    console.log(r2.toString());
};
//为了方便理解，我们看下面这个例子
var g = gen();
var r1 = g.next();
r1.value(function (err, data) {
    if (err) throw err;
    var r2 = g.next(data);
    r2.value(function (err, data) {
        if (err) throw err;
        g.next(data);
    })
})

/**
 * Thunk函数的自动流程管理
 */
function run(fn) {
    var gen = fn();
    function next(err, data) {
        var result = gen.next(data);
        if (result.done) return;
        result.value(next);
    }

    next();
}
function* g() {
    // ...
}
run(g);

/**
 * CO模块
 * 是著名程序员 TJ Holowaychuk 于 2013 年 6 月发布的一个小工具，
 * 用于 Generator 函数的自动执行。
 */
var gen = function* () {
    var f1 = yield readFile('/etc/fstab');
    var f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
var co = require('co');
co(gen);
co(gen).then(function () {
    console.log('Generator 函数执行完成');
});

/**
 * 基于Promise对象的自动执行
 */
var fs = require('fs');
var readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
};
var gen = function* () {
    var f1 = yield readFile('./etc/fff');
    var f2 = yield readFile('./etc/qqq');
}
var g = gen();
g.next().value.then(function (data) {
    g.next(data).value.then(function (data) {
        g.next(data);
    })
})

