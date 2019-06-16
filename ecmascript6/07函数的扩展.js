/**
 * 函数参数默认值
 * ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。
 */
function log(x, y = 'World') {
    console.log(x, y);
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello

/**
 * 在es6中，参数变量是默认声明的，所以不能用let或const再次声明。
 */
function foo(x = 5) {
    let x = 1; // error
    const x = 2; // error
}

/**
 * 与解构赋值默认值结合使用
 */
function foo({ x, y = 5 }) {
    console.log(x, y);
}
foo({}) // undefined 5
foo({ x: 1 }) // 1 5
foo({ x: 1, y: 2 }) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined

/**
 * 定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。
 * 如果非尾部的参数设置默认值，实际上这个参数是没法省略的。
 */
// 例一
function f(x = 1, y) {
    return [x, y];
}
f() // [1, undefined]
f(2) // [2, undefined])
f(, 1) // 报错
f(undefined, 1) // [1, 1]
// 例二
function f(x, y = 5, z) {
    return [x, y, z];
}
f() // [undefined, 5, undefined]
f(1) // [1, 5, undefined]
f(1, , 2) // 报错

    /**
     * 函数的length属性
     * 函数在指定了默认值以后，length属性就会失真
     */
    (function (a) { }).length // 1
    (function (a = 5) { }).length // 0
    (function (a, b, c = 5) { }).length // 2

    /**
     * 如果函数的默认参数不是尾参数，那么length属性不会计算默认参数之后的参数
     */
    (function (a = 0, b, c) { }).length // 0
    (function (a, b = 1, c) { }).length // 1

/**
 * 下面代码中，函数f调用时，参数y = x形成一个单独的作用域。
 * 这个作用域里面，变量x本身没有定义，所以指向外层的全局变量x。
 * 函数调用时，函数体内部的局部变量x影响不到默认值变量x
 */
let x = 1;
function f(y = x) {
    let x = 2;
    console.log(y);
}
f() // 1

var x = 1;
function foo(x = x) {
    // ...
}
foo() // ReferenceError: x is not defined
//因为参数x=x形成了一个单独的作用域，实际执行是let x = x;由于暂时性死区，
//所以代码会报x未定义

/**
 * 下面代码中，函数bar的参数func的默认值是一个匿名函数，
 * 返回值为变量foo。函数参数形成的单独作用域里面，并没有定义变量foo，
 * 所以foo指向外层的全局变量foo，因此输出outer。
 */
let foo = 'outer';
function bar(func = () => foo) {
    let foo = 'inner';
    console.log(func());
}
bar(); //outer

/**
 * 接下来是一个自己新认识的例子，和上面的例子一样
 * 加上这次的例子，对函数参数是函数来说，参数会形成一个单独的作用域，这个作用域
 * 不会指向全局，也不会指向当前函数，就是和执行函数一样有了自己的作用域，
 * 所以下面这个例子，x既不会影响全局变量也不会影响执行函数的局部变量
 * 因为参数里的函数（局部作用域）已经声明了该变量
 */
var x = 1;
function foo(x, y = function () { x = 2; }) {
    var x = 3;
    y();
    console.log(x);
}
foo() // 3
x // 1
//上面代码中，函数foo的参数形成一个单独作用域。这个作用域里面，
//首先声明了变量x，然后声明了变量y，y的默认值是一个匿名函数。
//这个匿名函数内部的变量x，指向同一个作用域的第一个参数x。
//函数foo内部又声明了一个内部变量x，该变量与第一个参数x由于不是同一个作用域，
//所以不是同一个变量，因此执行y后，内部变量x和外部全局变量x的值都没变。

/**
 * 如果将var x = 3的var去除，函数foo的内部变量x就指向第一个参数x，
 * 与匿名函数内部的x是一致的，所以最后输出的就是2，
 * 而外层的全局变量x依然不受影响。
*/
var x = 1;
function foo(x, y = function () { x = 2; }) {
    x = 3;
    y();
    console.log(x);
}
foo() // 2
x // 1
//个人理解认为，因为有参数x的存在，所以匿名函数和参数x是同一个作用域
//这就好比window中的全局变量和匿名函数中的变量，没有声明，一定会找到和他同级
//作用域的变量

/**
 * 下面这个技巧，可以指定某一个值不得省略
 */
function mustParameter() {
    throw new Error('you have to pass the parameters');
}
function demo(param = mustParameter()) {
    console.log(param);
}
demo();
//Uncaught Error: you have to pass the parameters

/**
 * 当然，我们也可以将函数参数设置为undefined
 */
function foo(optional = undefined) {
    //··· 
}

/**
 * rest参数（形式为...变量名）
 * 用于获取函数的多余参数，这样就不需要使用arguments对象了
 */
function add(...arr) {
    let sum = 0;
    for (var val of arr) {
        sum += val;
    }
    console.log(sum);
}
add(3, 4, 5, 8); //20

/**
 * 下面是一个利用 rest 参数改写数组push方法的例子
 */
function push(arr, ...items) {
    for (var i = 0; i < items.length; i++) {
        arr.push(items[i]);
    }
    console.log(arr);
}
var arr = [];
push(arr, 2, 3, 4, 5); //[2,3,4,5]

/**
 * 注意，在rest参数后不可以再加其他参数，否则会报错
 */
// 报错
function f(a, ...b, c) {
    // ...
}
//注意：函数的length属性不包括rest参数

/**
 * es6对函数的name进行了修改，如下
 */
var f = function () { };
// ES5
f.name // ""
// ES6
f.name // "f"

/**
 * es6允许使用箭头来定义函数
 */
var f = v => v;
f(2);
//等同于
var f = function (v) {
    return v;
}

/**
 * 如果箭头函数的代码块多余一条语句，那么就要用大括号括起来
 */
var sum = (num1, num2) => { return num1 + num2; }

/**
 * 箭头函数有几个使用注意点
 */
// （1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
// （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
// （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
// （4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

// 上面四点中，第一点尤其值得注意。this对象的指向是可变的，但是在箭头函数中，它是固定的。

/**
 * 下面这个例子可以看到箭头函数this指的就是定义时所在对象
 */
function foo() {
    setTimeout(() => {
        console.log('id:' + this.id);
    })
}
var id = 21;
foo.call({ id: 42 });

/**
 * 箭头函数可以让setTimeout里面this指向定义是所在的作用域
 */
function Timer() {
    this.s1 = 0;
    this.s2 = 0;
    // 箭头函数
    setInterval(() => this.s1++, 1000);
    // 普通函数
    setInterval(function () {
        this.s2++;
    }, 1000);
}
var timer = new Timer();
setTimeout(() => console.log('s1: ', timer.s1), 3100);
setTimeout(() => console.log('s2: ', timer.s2), 3100);
// s1: 3
// s2: 0
//Timer函数内部设置了两个定时器，分别使用了箭头函数和普通函数。
//前者的this绑定定义时所在的作用域（即Timer函数），
//后者的this指向运行时所在的作用域（即全局对象）

/**
 * 箭头函数可以让this指向固定化，这种特性有利于封装回调函数
 */
var handler = {
    id: "123456",
    init: function () {
        document.addEventListener('click', event => this.doSomeThing(event.type), false);
    },
    doSomeThing: function (type) {
        console.log(this.id);
    }
}

/**
 * this指向固定化，并不是因为箭头函数内部有绑定的this机制，而是因为箭头函数
 * 没有自己的this，导致内部的this就是外层代码块的this，
 * 正因为它没有this，所以不能用作构造函数
 */

/**
 * 箭头函数不适用场景
 * 1.定义对象的方法，且该方法内部包括this
 * 2.在需要动态this的时候，也不可以使用箭头函数
 */
// 1:
const cat = {
    lives: 9,
    jumps: () => {
        this.lives--
    }
}
//这个例子，this没有指向cat对象，而是指向了全局window，因为在es6里
//对象不会构成单独的作用域

//2:
var button = document.getElementById('press');
button.addEventListener('click', () => {
    this.classLists.toggle('on');
})
//上面的代码会报错，因为对象不会被解析成一个单独的作用域，所以this还是指向window

/**
 * 下面是一个嵌套函数的例子
 * 两种写法，一个es5，一个es6
 */
function qq(values = [1, 2, 3, 4, 5]) {
    let val1 = values;
    return {
        ww: function (value) {
            val1 = val1.filter(t => t != value)
            return {
                ee: function (args) {
                    val1 = val1.filter(t => t != args)
                    console.log(this);
                    console.log(val1);
                }
            }
        }
    }
}
qq().ww(3).ee(4);
//es6写法
let qq = (values = [1, 2, 3, 4, 5]) => {
    let val1 = values;
    return {
        ww: (value) => {
            val1 = val1.filter(t => t != value);
            return {
                ee: (args) => {
                    val1 = val1.filter(t => t != args)
                    console.log(this);
                    console.log(val1);
                }
            }
        }
    }
}

/**
 * 尾调用时函数式编程的一个重要概念，本身非常简单，一句话就能说清楚
 * 就是指函数的最后一步调用另一个函数
 * 以下三种情况都不属于为调用
 */
// 情况一
function f(x) {
    let y = g(x);
    return y;
}
// 情况二
function f(x) {
    return g(x) + 1;
}
// 情况三
function f(x) {
    g(x);
}
//尾调用不一定出现在函数尾部，只要是最后一步操作即可

/**
 * 尾调用优化
 * 尾调用是函数最后一步操作，所以不需要保留外层函数的调用帧，
 * 调用位置，内部变量都不会再用到了
 */
function f() {
    let x = 20;
    let y = 20;
    return g(x, y);
}
f();
//等同于
function f() {
    return g(3);
}
f();
//等同于
g(3);
//尾调用优化，只要不再用外层函数的变量，
//内层函数调用帧才会取代外层函数的调用帧
//这样大大节省内存，这就是“尾调用优化”

/**
 * 函数调用自身，称为递归。如果尾调用自身，就称为尾递归。
 * 递归非常耗费内存，因为需要同时保存成千上百个调用帧，
 * 很容易发生“栈溢出”错误（stack overflow）。
 * 但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误
 */
//下面的代码是一个普通的递归，需要保存n个调用记录
function factorial(n) {
    if (n === 1) {
        return 1;
    }
    return n * factorial(n - 1)
}
//下面是一个尾递归实现上面的例子
function factorial(n, total) {
    if (n === 1) {
        return total;
    }
    return factorial(n - 1, n * total);
}
//这个例子可以看做是利用参数将上一次的值保留起来，调用下一次的自身

/**
 * 只要使用’尾部优化‘，都不会发生栈溢出
 */

/**
 * 递归函数的改写和优化
 * 在尾递归函数之外，提供一个正常形势的函数
 */
function factorial(n) {
    return totalFactorial(n, 1);
}
function totalFactorial(n, total) { //5 1=> 4 5=>3 20=> 2 60 => 1  120
    if (n === 1) return total;
    return totalFactorial(n - 1, n * total);
}
factorial(5); //120

/**
 * es2017允许函数的最后一个参数有尾逗号
 * 
 */
function clownsEverywhere(
    param1,
    param2,
) { /* ... */ }

clownsEverywhere(
    'foo',
    'bar',
);