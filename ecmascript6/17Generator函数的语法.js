/**
 * Generator是es6提供的一种异步编程的解决方案
 * 执行generator函数返回一个遍历器对象，也就是说，Generator函数除了
 * 状态机，还是一个遍历器的对象生成函数
 */
function* helloworldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}
var hw = helloworldGenerator();
//上面定义了Generator函数，不同的是，调用函数并不执行，返回的也不是函数运行结果
//而是一个指向内部状态的指针对象
//下一步，必须调用next方法，使得指针移向下一个状态
hw.next()
// { value: 'hello', done: false }
hw.next()
// { value: 'world', done: false }
hw.next()
// { value: 'ending', done: true }
hw.next()
// { value: undefined, done: true }
//上面的代码，当yield执行完，done属性的值就会变为true

/**
 * es6没有规定function关键字与函数名之间的星号具体写在哪个位置，这导致下面的写法都可以通过
 */
function* foo(x, y) { }
function* foo(x, y) { }
function* foo(x, y) { }
function* foo(x, y) { }

/**
 * yield表达式就是暂停标志，遍历器对象的next方法的运行逻辑如下：
 * 1.遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的表达式的值，作为返回对象的value值
 * 2.下一次调用next方法，再继续往下执行，直到遇到下一个value属性值
 * 3.如果没有遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，
 * 并将return语句后的的值，作为返回对象的value属性值
 * 4.如果该函数没有return语句，则返回该对象的value属性值为undefined
 */

/**
 * 正常函数只能返回一个值，因为只能执行一次return，而Generator函数可以返回一系列的值
 * 因为可以有任意多个yield
 * 英文中，Generator译为“生成器”
 */

/**
 * Generator函数可以不用yield表达式，这时就变成了一个淡村的暂缓执行函数
 */
function* f() {
    console.log('执行了');
}
var generator = f();
generator.next(); //’执行了‘ 

/**
 * 下面是一个例子
 */
var arr = [1, [[2, 3], 4], [5, 6]];
function* flat(arr) {
    var length = arr.length;
    for (var i = 0; i < length; i++) {
        var item = arr[i];
        if (typeof arr[i] !== 'number') {
            yield flat(item);
        } else {
            yield item;
        }
    }
}
for (let f of flat(arr)) {
    console.log(f);
}
// 1 2 3 4 5 6

/**
 * 与Interator接口的关系
 * 上一章说过，任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数
 * 调用该函数会返回该对象的一个遍历器对象
 * 由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 
 * 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。
 */
var myInterator = {};
myInterator[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
}
[...myInterator]; //[1,2,3]
/**
 * 由于generator函数就是遍历器生成函数，因此可以把Generator赋值给对象的
 * Symbol.iterator接口，就可以被...运算符运算
 */

/**
 * Generator函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性
 * 执行后返回自身
 */
function* gen() {

}
var g = gen();
g[Symbol.iterator] === g;  //true


/**
 * next方法的参数
 * yield表达式本身没有返回值，或者总是会犯undefined，next方法可以带一个参数，
 * 该参数就会被当作上一个yield表达式返回值
 */
function* f() {
    for (var i = 0; true; i++) {
        var reset = yield i;
        if (reset) { i = -1; }
    }
}
var g = f();
g.next();//{ value: 0, done: false }
g.next();//{ value: 1, done: false }
g.next(true); //{ value: 0, done: false }

/**
 * Generator函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数的行为
 */
//现在看一个例子：
function* foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
}
var a = foo(5);
var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}
//下面如果给Generator函数注入值，返回结果就完全不一样了
var b = foo(5);
b.next(); //{value:6, done:false} 
//因为这个时候走到了第一个yield，所以直接返回5+1
b.next(12); //{value:8, done:false}
//这个时候调用next,走到了第二个yield表达式，传递的参数12代表上一次yield值设置为12
//所以在第二个yield返回2*12/3  8
b.next(13);//{value:42, done:true}
//因为此时走到了Generator函数的return，所以此时z=13，y=24,x=5,所以返回42

/**
 * 下面再看一个通过next方法的参数，向Generator函数内部输入值的例子
 */
function* foo() {
    console.log('started');
    console.log(`1 ${yield}`);
    console.log(`2 ${yield}`);
}
let obj = foo();
obj.next();// started
obj.next('a'); //1 a
obj.next('b'); // 2 b

/**
 * for of 循环
 * 可以自动遍历Generator函数运行时生成的Iterator对象，且此时不再需要调用next方法
 */
function* foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}
for (let v of foo()) {
    console.log(v);
}
// 1 2 3 4 5
//上面的代码，一旦next的返回对象的done为true，for of 循环就会终止

/**
 * 下面这个例子是利用Generator函数实现斐波那契列的例子
 */
function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (; ;) {
        yield curr;
        [prev, curr] = [curr, prev + curr]
    }
}
for (let n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
}

/**
 * 下面，我们利用Generator函数为Object对象添加for of 循环
 */
function* objectEntries(obj) {
    let props = Reflect.ownKeys(obj);
    for (let prop of props) {
        yield [prop, obj[prop]];
    }
}
let jane = { filst: "Jane", last: "Doe" };
for (let [key, value] of objectEntries(obj)) {
    console.log(`${key}:${value}`);
}
// first: Jane
// last: Doe

/**
 * 除了for...of循环以外，扩展运算符（...）,解构赋值和Array.from方法内部调用的，
 * 都是遍历器接口
 */
function* numbers() {
    yield 1
    yield 2
    return 3
    yield 4
}
// 扩展运算符
[...numbers()] // [1, 2]
// Array.from 方法
Array.from(numbers()) // [1, 2]
// 解构赋值
let [x, y] = numbers();
x // 1
y // 2
// for...of 循环
for (let n of numbers()) {
    console.log(n)
}
// 1
// 2

/**
 * Generator.prototype.throw()
 * Generator函数返回的遍历对象，都有一个throw方法，可以在函数体外抛出错误
 * 然后在Generator函数体内捕获
 */
var g = function* () {
    try {
        yield;
    } catch (e) {
        console.log('内部捕获', e);
    }
}
var i = g();
i.next();
try {
    i.throw('a');
    i.throw('b');
} catch (e) {
    console.log('外部捕获', e);
}
//内部捕获 a
//外部捕获 b
//因为上面抛出了两个错误，而Generator函数内的catch执行过了，所以外部捕获到

/**
 * 注意：不要混淆遍历器对象的throw方法，它和全局的throw命令不一样，
 * 全局throw命令只能被函数体外捕获
 */

/**
 * 如果Generator函数内部没有try...catch代码块，抛出的错误将被外部catch捕获
 */
var g = function* () {
    while (true) {
        yield;
        console.log('内部捕获', e);
    }
};
var i = g();
i.next();
try {
    i.throw('a');
    i.throw('b');
} catch (e) {
    console.log('外部捕获', e);
}
// 外部捕获 a

/**
 * 如果Generator函数体内和外部都没有部署try...catch代码块，那么抛出错误，直接中断执行
 */
var gen = function* gen() {
    yield console.log('hello');
    yield console.log('world');
}
var g = gen();
g.next();
g.throw();
// hello
// Uncaught undefined

/**
 * throw方要被内部捕获，至少运行一次next方法
 */
function* gen() {
    try {
        yield 1;
    } catch (e) {
        console.log('内部捕获');
    }
}
var g = gen();
g.throw(1);
// Uncaught 1

/**
 * throw方法被捕获后，会附带执行一次next方法
 */
var gen = function* () {
    try {
        yield console.log('a');
    } catch (e) {

    }
    yield console.log('b');
    yield console.log('c');
}
var g = gen();
g.next(); //'a'
g.throw(); //'b'
g.next(); //'c'

/**
 * Generator.prototype.return()
 * Generator函数返回的遍历器对象，还有一个return方法，可以返回指定的值，
 * 并且终结遍历Generator函数
 */
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}
var g = gen();
g.next();//{ value: 1, done: false }
g.return('foo'); //{ value: ’foo‘, done: true }
g.next();//{ value: undefined, done: true }

/**
 * 如果return不提供参数，那么返回的值value属性为undefined
 */

/**
 * 如果Generator函数内部有tyr...finally代码块，且在正在执行try代码块，那么
 * return方法会推迟到finally代码块执行完在执行
 */
function* numbers() {
    yield 1;
    try {
        yield 2;
        yield 3;
    } catch (e) {
        yield 4;
        yield 5;
    }
    yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }

/**
 * next()  throw() return() 的共同点
 * 这三个方法本质上是同一件事，可以放在一起理解
 * 它们的作用就是让Generator函数恢复执行，并且使用不同的语句替换yield表达式
 */
//next就是讲yield表达式替换成一个值
const g = function* (x, y) {
    let result = yield x + y;
    return result;
}
const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}
gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;

/**
 * throw是将yield表达式替换成一个throw语句
 */
gen.throw(new Error('error'));// Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));

/**
 * return是将yield表达式替换成一个return语句
 */
gen.return(2);//Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;

/**
 * yield* 表达式
 * 如果在Generator函数内部，调用另一个Generator函数，需要在前者的
 * 函数体内部，手动完成遍历操作
 */
function* foo() {
    yield 'a';
    yield 'b';
}
function* bar() {
    yield 'x';
    //手动遍历foo
    for (let i of foo()) {
        comsole.log(i);
    }
    yield 'y';
}
for (let v of bar()) {
    console.log(v); // x a b y
}

/**
 * 像上面代码所写，foo和bar都是Generator函数，bar里面调用foo，就需要手动遍历
 * foo，如果有多个Generator函数，写起来非常麻烦，这个时候，我们就用到了yield*
 */
function* bar() {
    yield 'x';
    yield* foo();
    yield 'y';
}
// x a b y

/**
 * 再来看一个对比的例子
 */
function* inner() {
    yield 'hello!';
}
function* outer1() {
    yield 'open';
    yield inner();
    yield 'close';
}
var gen = outer1()
gen.next().value // "open"
gen.next().value // 返回一个遍历器对象
gen.next().value // "close"
function* outer2() {
    yield 'open'
    yield* inner()
    yield 'close'
}
var gen = outer2()
gen.next().value // "open"
gen.next().value // "hello!"
gen.next().value // "close"

/**
 * 再看一个简单的例子，便于理解
 */
let delegatedIterator = (function* () {
    yield 'Hello!';
    yield 'Bye!';
}());
let delegatingIterator = (function* () {
    yield 'Greetings!';
    yield* delegatedIterator;
    yield 'Ok, bye.';
}());
for (let value of delegatingIterator) {
    console.log(value);
}
// "Greetings!
// "Hello!"
// "Bye!"
// "Ok, bye.

/**
 * yield* 后面的Generator函数（没有return语句时），等同于
 * 在Generator函数内部，部署了一个for...of循环
 */
function* cancat(iter1, iter2) {
    yield* iter1;
    yield* iter2;
}
//等同于
function* concat(iter1, iter2) {
    for (let v of iter1) {
        yield v;
    }
    for (let v of iter2) {
        yield v;
    }
}

/**
 * 上面的代码说明，yield*后面的Generator函数（没有return语句时）
 * 不过是for...of的一种简写形式，反之，如果有return语句时，则需要用
 * var value=yield* iterator的形式获取return语句的值
 */

/**
 * 下面的代码，yield命令后如果不加星号，返回的是整个数组，加了星号就表示
 * 返回的是数组的遍历器对象
 */
function* gen() {
    yield* ['a', 'b', 'c'];
}
gen().next();//{ value:"a", done:false }

/**
 * 实际上，任何数据结构只要有Iterator接口，就可以被yield*遍历
 */
let read = (function* () {
    yield 'hello';
    yield* 'hello';
})();
read.next().value; //'hello'
read.next().value;//'h'

/**
 * 如果被代理的Generator函数有return语句，那么就可以向代理它的Generator
 * 函数返回数据
 */
function* foo() {
    yield 2;
    yield 3;
    return 'foo';
}
function* bar() {
    yield 1;
    var v = yield* foo();
    console.log('v:' + v);
    yield 4;
}
var it = bar();
it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}

/**
 * yield*可以很方便的取出嵌套数组的所有成员
 */
function* itertree(tree) {
    if (Array.isArray(tree)) {
        for (let i = 0; i < tree.length; i++) {
            yield itertree(tree[i]);
        }
    } else {
        yield tree;
    }
}
const tree = ['a', ['b', 'c'], ['d', 'e']];
for (let v of itertree(tree)) {
    console.log(v);
}
// a b c d e

/**
 * 由于扩展运算符（...）默认调用intertor接口，所以上面的例子也可以用于嵌套的平铺
 */
[...itertree(tree)];

/**
 * 下面是一个稍微复杂的例子，使用yield*语句遍历完全二叉树
 */
function Tree(left, label, right) {
    this.left = left;
    this.label = label;
    this.right = right;
}
function* inorder(t) {
    if (t) {
        yield* inorder(t.left);
        yield t.label;
        yield* inorder(t.right);
    }
}
function make(array) {
    if (array.length === 1) return new Tree(null, array[0], null);
    return new Tree(make(array[0], array[1], make(array[2])));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);
// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
    result.push(node);
}
result
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']

/**
 * 作为属性Generator函数
 */
let obj = {
    * myGenerator() {
        //...
    }
};

/**
 * Generator函数的this
 * Generator函数总是返回一个遍历器，es6规定这个遍历器是Generator函数的实例
 * 也继承了Generator函数的prototype对象上的方法
 */
function* g() { }
g.prototype.hello = function () {
    return 'hi';
}
let obj = g();
obj instanceof g;  //true
obj.hello(); //'hi'

/**
 * 如果把g当做普通的构造函数，并不会生效，因为g返回的总是遍历器对象，而不是this对象
 */
function* g() {
    this.a = 11;
}
let obj = g();
obj.next();
obj.a; //undefined

/**
 * 下面是一个变通的方法，首先，生成一个空对象，使用call方法绑定Generator函数
 * 内部的this，构造函数调用以后，这个空对象就是Generator对象的实例对象了
 */
function* F() {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
var obj = {};
var f = F.call(obj);
f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}
obj.a // 1
obj.b // 2
obj.c // 3

/**
 * 上面的代码，执行的遍历器对象f，但是生成的对象实例是obj，
 * 为了解决这个问题，一个办法就是将obj换成F.prototype
 */
function* F() {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
var f = F.call(F.prototype);
f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}ß
f.a // 1
f.b // 2
f.c // 3

/**
 * 再将F改成构造函数，就可以对它执行new命令了
 */
function* gen() {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
function F() {
    return gen.call(gen.prototype);
}
var f = new F();
f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}
f.a // 1
f.b // 2
f.c // 3

/**
 * Generator与状态机
 * Generator是实现状态机的最佳结构
 */
var ticking = true;
var clock = function () {
    if (ticking) console.log('Tick');
    else console.log('Tock');
    ticking = !ticking;
}
//如果使用Generator函数实现，就是下面这样
var clock = function* () {
    while (true) {
        console.log('Tick');
        yield;
        console.log('Tock');
        yield;
    }
}

/**
 * Generator与协程
 * 协程是一种程序运行的方式，可以理解为“协作的程序”或“协作的函数”
 * 协程可以用单线程实现，也可以用多线程实现，前者是一种特殊的子例程，后者是一种特殊的线程
 */

/**
 * (1)协程与子例程的差异
 * 传统的“子例程”采用堆栈式“后进先出”的执行方式，只有当调用的子函数完全执行完毕
 * 才会结束执行父函数，协程预与其不同，多个线程（单线程情况下，即多个函数）
 * 可以并行执行
 */

/**
 * 一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数）
 * ，等到稍后收回执行权的时候，再恢复执行，这种可以并行执行，交换执行权
 * 的线程（或函数），就成为协程
 */

/**
 * (2)协程与普通线程的差异
 * Generator函数式es6对协程的实现，但属于不完全实现
 * Generator函数被称为“半协程”，意思是只有调用者才能将程序的执行权
 * 还给Generator函数，如果是完全协程，任何函数都可以让暂停的协程继续执行
 */

/**
 * Generator与上下文
 * Generator函数执行产生的上下文，一旦遇到yield命令，就会暂时退出堆栈，
 * 但并不是消失，里面的所有变量和对象户冻结在当前状态，等到它执行next
 * 命令，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行
 */
function* gen() {
    yield 1;
    return 2;
}
let g = gne();
console.log(
    g.next().value,
    g.next().value
);

/**
 * 下面介绍Generator函数的应用：
 */

/**
 * (1)异步操作的同步化表达
 */
function* main() {
    var result = yield request('https://some.url');
    var resp = JSON.parse(result);
    console.log(resp);
}
function requerst(url) {
    makeAjaxCall(url, function (response) {
        it.next(response);
    })
}
var it = main();
it.next();

/**
 * (2)控制流管理
 */
//如果有一个多步操作非常耗时，采用回调函数，可以写成下面这样
step1(function (value1) {
    step2(value1, function (value2) {
        step3(value2, function (value3) {
            step4(value3, function (value4) {
                // Do something with value4
            });
        });
    });
});
//采用Promise改写上面的代码
Promise.resolve(step1)
    .then(step2)
    .then(step3)
    .then(step4)
    .then(function (value4) {
        // Do something with value4
    }, function (error) {
        // Handle any error from step1 through step4
    })
    .done();
//Generator 函数可以进一步改善代码运行流程
function* longRunningTask(value1) {
    try {
        var value2 = yield step1(value1);
        var value3 = yield step2(value2);
        var value4 = yield step3(value3);
        var value5 = yield step4(value4);
        // Do something with value4
    } catch (e) {
        // Handle any error from step1 through step4
    }
}
//下面，利用for...of循环会自动依次执行yield命令的特性，提供一种更一般的控制流管理的方法。
let steps = [step1Func, step2Func, step3Func];

function* iterateSteps(steps) {
    for (var i = 0; i < steps.length; i++) {
        var step = steps[i];
        yield step();
    }
}

/**
 * for of的本质是一个while循环
 */
var it = iterateJobs(jobs);
var res = it.next();
while (!res.done) {
    var result = res.value;
    res = it.next();
}

/**
 * (3)部署Iterator接口
 * 利用Generator函数可以在任意对象上部署Iterator接口
 */
function* makeSimpleGenerator(array) {
    var nextindex = 0;
    while (nextindex < array.length) {
        yield array[nextindex++]
    }
}
var gen = makeSimpleGenerator(['yo', 'ya']);
gen.next().value // 'yo'
gen.next().value // 'ya'
gen.next().done  // true

/**
 * (4)作为数据结构
 * Generator可以看做是数据结构，这意味着它可以对任意表达式，提供类似的接口
 */
function* doStuff() {
    yield fs.readFile.bind(null, 'hello.txt');
    yield fs.readFile.bind(null, 'world.txt');
    yield fs.readFile.bind(null, 'and-such.txt');
}
for (task of doStuff()) {
    // task是一个函数，可以像回调函数那样使用它
}

