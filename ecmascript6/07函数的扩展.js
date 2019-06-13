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