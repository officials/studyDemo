/**
 * ES6 新增了let命令，用来声明变量。它的用法类似于var，
 * 但是所声明的变量，只在let命令所在的代码块内有效。
 */
let { log } = console;
{
    let a = 10;
    var b = 1;
}
a //a is not defined
b //1

/**
 * for循环的计数器，就很合适使用let命令
 */

for (let i = 0; i < 5; i++) {
    log(i);
}
log(i);
//1 2 3 4 5
//i is not defined
//因为es6的let和const都是块级作用域，
//所以在外部访问不到，而在for循环内使用变量，
//也不会像es5那样，得用闭包或者重新复制

/**
 * 再看下面一组例子
 */
var a = [];
for (let i = 0; i < 10; i++) {
    a[i] = function () {
        log(i);
    }
}
a[5]();
//上面代码中，变量i是let声明的，
//当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量

/**
 * let const不存在变量提升
 */
console.log(foo); // 输出undefined
var foo = 2;

/**
 * 暂时性死区
 * 就是不允许在同一个作用域声明两个一样的变量，否则会报错
 */
var tmp = 123;

if (true) {
    tmp = 'abc'; // ReferenceError
    let tmp;
}
//Cannot access 'tmp' before initialization

/**
 * 另外，下面的代码也会报错，与var的行为不同
 */
// 不报错
var x = x;
// 报错
let x = x;
// ReferenceError: x is not defined

/**
 * 接下来，再来看一个es5的例子，这也就是为什么需要块级作用域
 */
var tmp = Date.now();
function f() {
    log(tmp);
    var tmp = 'hello feng';
}
f(); //undefined
//因为在函数体内，var导致变量提升，所以会污染tmp变量

/**
 * 我们再举上面的for循环中使用let的好处
 */
var s = 'hello';
for (var i = 0; i < s.length; i++) {
    log(i);
}
// 5 5 5 5 5

/**
 * 在上面的代码里，我们说在同一作用域不允许声明两个一样的变量
 * 但是在function里可以，虽然不会报错，但是无意义
 * 二次声明的变量不会重写已经存在的变量
 */
function f1() {
    let n = 5;
    if (true) {
        let n = 10;
    }
    console.log(n); // 5
}
f1(); //5 

/**
 * 以下这份代码，在es5、es6环境里的输出结果不一样
 * 因为es5会将外部作用域的变量重写，而es6不允许这样
 */
function f() { console.log('I am outside!'); }

(function () {
    function f() { console.log('I am inside!'); }
    if (false) {
    }
    f();
}());
//es5:I am inside!
//es6:I am outside!

/**
 * 如果将上面的代码自执行匿名函数的f()放在if(false)里，将会报错
 * 因为es6规定：块级作用域之中，
 * 函数声明语句的行为类似于let，在块级作用域之外不可引用。
 */
function f() { console.log('I am outside!'); }

(function () {
    if (false) {
        // 重复声明一次函数f
        function f() { console.log('I am inside!'); }
    }

    f();
}());
//f is not a function

/**
 * 还有一个需要主要注意的地方，就是在es6的块级作用域必须有大括号
 * 比如我们在es5里可以省略的大括号，在es6中会报错
 */
// 第一种写法，报错
if (true) let x = 1;
// 第二种写法，不报错
if (true) {
    let x = 1;
}

/**
 * 在严格模式下，函数声明也只能在作用域的顶层
 * 
 */
// 不报错
'use strict';
if (true) {
    function f() { }
}
// 报错
'use strict';
if (true)
    function f() { }

/**
 * const声明一个只读的常量。一旦声明，常量的值就不能改变
 */
const PI = 3.1415;
PI // 3.1415
PI = 3;
// TypeError: Assignment to constant variable

/**
 * const和let作用域相同，也不可重复声明
 */
const foo = {};
// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123
// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only

/**
 * 下面的代码，也和上面的代码是一个道理
 */
const a = [];
a.push('Hello'); // 可执行
a.length = 0;    // 可执行
a = [0];    // 报错
// Identifier 'a' has already been declared

/**
 * 如果想要冻结对象，可以使用Object.freeze()
 */
const foo = Object.freeze({});
// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;

/**
 * ES6 声明变量的六种方法
 */
//var,function,let,const,import,class

/**
 * 在es5中，全局变量与顶级对象window挂钩，这也是JavaScript最大的败笔之一
 * 在es6中，全局变量将逐步与顶层对象脱钩
 */
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1
let b = 1;
window.b // undefined

/**
 * 下面带给一个彩蛋：在上面的代码中，我们将console.log简写成了log()
 * 将会是下章学习的变量的解构
 */
const { log } = console;

