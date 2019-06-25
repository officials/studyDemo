import { readFile } from "fs";

/**
 * es2017引入了async,使得异步操作更为方便
 * 其实就是Generator邯郸的语法糖
 */
//其实就是将Generator函数的*替换成async,将yield替换成await
const asyncReadFile = async function () {
    const f1 = await readFile('/gggg');
    const f2 = await readFile('/aaaa');
}

/**
 * async特点：
 * 1.内置执行器
 * 2.更高的语义
 * 3.更广的适用性
 * 4.返回值是Promise
 */

/**
 * async函数返回一个Promise对象，可以使用then方法添加回调函数
 * 当函数体执行，一旦遇到await就会先返回，等到异步操作完成，再接着执行
 * 函数体后面的语句
 */
async function getStock(name) {
    const symbol = await getStockSymbol(name);
    const stockPrice = await getStockPrice(symbol);
    return stockPrice;
}
getStock('good').then(function (result) {
    console.log(result);
})

/**
 * 下面是一个例子，执行50毫秒后输出’hello world‘
 */
function timeout(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, ms)
    })
};
async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}
asyncPrint('hello world', 50);

/**
 * async函数有多种使用方式：
 */
async function foo() { };
const foo = async function () { };
let obj = { async foo() { } };
class Storage {
    constructor() {
        this.cachePromise = caches.open('avatars');
    }
    async getAvatar(name) {
        const cache = await this.cachePromise;
        return cache.match(`/avatars/${name}.jpg`);
    }
}
const storage = new Storage();
storage.getAvatar('jake').then();
// 箭头函数
const foo = async () => { };

/**
 * 返回Promise对象
 * async 函数内部的return语句返回的值，回作为then方法回调函数的参数
 */
async function f() {
    return 'hello';
}
f().then(v => { console.log(v); }) //'hello'

/**
 * async函数内部抛出错误，会导致返回的Promise对象变成reject状态，抛出的
 * 错误对象会被catch方法回调函数捕获
 */
async function f() {
    throw new Error('出错了');
}
f().then(
    v => console.log(v),
    e => console.log(e)
);
// '出错了'

/**
 * Promise对象的状态变化
 * async函数返回的Promise对象，必须等到函数内部所有await执行完，
 * 才会改变状态，除非遇到return语句或者抛出错误，也就是说，
 * 只有async全部执行完，才可以调用then方法执行的回调函数
 */

/**
 * await命令
 * 正常情况下，await后面跟的是一个Promise对象，返回该对象的结果
 * 如果不是Promise对象，就直接返回对应的值
 */
async function f() {
    return await 123;
    //等同于
    // return 123
}
f().then(v => console.log(v)); //123

/**
 * 另一种情况是，await后面是一个thenable对象。
 * 那么await会将等同于Promise对象
 */
class Sleep {
    constructor(timeout) {
        this.timeout = timeout;
    }
    then(resolve, reject) {
        const startTime = Date.now();
        setTimeout(() => resolve(Date.now - startTime), this.timeout)
    }
}
(async () => {
    const sleepTime = await new Sleep(1000);
    console.log(sleepTime);
})();
//上面代码中，await命令后是一个Sleep对象的实例，这个实例不是Promise对象
//但是因为定义了then方法，await会将其视为Promise处理

/**
 * 下面利用await语法实现JavaScript休眠的例子
 */
function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, timeout)
    })
}
async function sleepFunc() {
    for (let i = 0; i < 5; i++) {
        console.log(i);
        await sleep(1000);
    }
}
sleepFunc();

/**
 * await后面的Promise对象如果变成rejected状态，则reject返回的参数会被catch
 * 方法的回到函数接收到
 */
async function f() {
    await Promise.reject('error');
}
f()
    .then(v => console.log(v))
    .catch(e => console.log(e)) //'error'

/**
 * 有时，我们希望前一个异步操作失败，也不要中断后面的异步操作
 * 这是我们可以把第一个await放在try...catch里，这样不管这个异步操作是否成功，
 * 第二个await都会执行
 */
async function f() {
    try {
        await Promise.reject('error');
    } catch (e) {

    }
    return await Promise.resolve('hello');
}
f()
    .then(v => console.log(v));//'hello'

/**
 * 
 * 另外一个就是await后面的Promise对象再跟一个catch方法，处理前面可能出现的错误
 */
async function f() {
    await Promise.reject('err')
        .catch(e => console.log(e)) //'err'
    return await Promise.resolve('ok');
}
f().then(e => console.log(e)); //'ok'

/**
 * 错误处理，如果await后面的异步操作出错，那么等同于async函数返回的Promise被reject
 */
async function f() {
    await new Promise(function (resolve, reject) {
        throw new Error('err');
    })
}
f()
    .then(v => console.log(v))
    .catch(e => console.log(e)); // 'err'

/**
 * 为防止出错，可以将异步放入try...catch代码块中，
 * 如果有多个await命令，可以统一放在try...catch中
 */

/**
 * 使用注意点：
 */

/**
 * （1）前面已经说过，await命令后的Promise对象，运行结果可能是rejected，
 * 所以最好把await命令放到try...catch代码块中
 */
async function myFunction() {
    try {
        await somethingReturnPromise();
    } catch (e) {
        console.log(e);
    }
}
//另一种写法：
async function myFunction() {
    await somethingReturnPromise()
        .catch(e => console.log(e))
}

/**
 * （2）多个await命令后的异步操作，如果不存在继发关系，最好让他们同时触发
 */
let foo = await getFoo();
let bar = await getBar();
//上面代码中，getFoo和getBar是两个独立的异步操作，互不依赖，被写成继发关系，比较耗时
//如果不是继关系，建议写成下面这样：
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
//或者：
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise();
let bar = await barPromise();

/**
 * （3）await命令只能用在async函数中，如果用在普通函数，就会报错
 */
async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));

    let results = await Promise.all(promises);
    console.log(results);
}
// 或者使用下面的写法
async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));
    let results = [];
    for (let promise of promises) {
        results.push(await promise);
    }
    console.log(results);
}

/**
 * （4）async可以保留运行堆栈
 */
const a = () => {
    b().then(() => c());
  };
/**
 * 上面代码中，函数a内部运行了一个异步任务b()。当b()运行的时候，
 * 函数a()不会中断，而是继续执行。等到b()运行结束，可能a()早就运行结束了，
 * b()所在的上下文环境已经消失了。如果b()或c()报错，错误堆栈将不包括a()。
 */
//现在改一下async函数
const a=async ()=>{
    await b();
    c();
}
//这样，b()运行的时候，a()会暂停，上下文环境会被保留

/**
 * async函数的实现原理
 * 就是讲Generator函数和自执行器，包装在一个函数里
 */
