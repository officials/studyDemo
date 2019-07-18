/**
 * 从数组和对象中提取值，对变量进行赋值，这被称为解构
 */
let [a, b, c] = [1, 2, 3];
// a 1   b 2    c 3

/**
 * 只要括号两边的模式相同，左边的变量就会被赋予对应的值
 */
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []

/**
 * 如果解构不成功，那么值就会被赋予undefined
 */
let [foo] = [];
let [bar, foo] = [1];
//以上这两种情况，foo都会被赋予undefined

/**
 * 另一种情况是不完全解构，即等号左边的模式，
 * 只匹配一部分的等号右边的数组。这种情况下，解构依然可以成功。
 */
let [x, y] = [1, 2, 3];
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4

/**
 * 下面几种情况，因为等号后面不受数组，将会报错
 */
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};

/**
 * 对于Set解构，也可以使用解构
 */
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"

/**
 * ES6 内部使用严格相等运算符（===），判断一个位置是否有值。
 * 所以，只有当一个数组成员严格等于undefined，默认值才会生效
 */
let [x = 1] = [undefined];
x //1
let [x = 1] = null;
x //null

/**
 * 下面的代码，因为x能娶到值，所以将不会执行f()
 */
function f() {
    console.log('aaa');
}

let [x = f()] = [1];

/**
 * 下面的例子里，需要注意，默认值必须已经声明才能赋值，
 */
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined

/**
 * 解构不仅可以用于数组，还可用于对象
 */
let { qq, ww } = {
    "qq": 12,
    "ww": "ww"
};
qq // 12
ww // ww
//等号左边的两个变量的次序，
//与等号右边两个同名属性的次序不一致，但是对取值完全没有影响
//对象解构要求等号左边的变量名与等号右边的属性名一致

/**
 * 如果解构失败，变量的值将等于undefined
 */
let { foo } = { bar: 'baz' };
foo // undefined

/**
 * 对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量
 */
// 例一
let { log, sin, cos } = Math;
// 例二
const { log } = console;
log('hello') // hello

/**
 * 对象的解构赋值的内部机制，是先找到同名属性，
 * 然后再赋给对应的变量。真正被赋值的是后者，而不是前者
 */
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
foo // error: foo is not defined

/**
 * 与数组一样，解构也可以用于嵌套结构的对象
 */
let obj = {
    p: [
        'Hello',
        { y: 'World' }
    ]
};

let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"

/**
 * 这时的p是模式，不是变量，因此不会被赋值，如果p也要作为变量赋值，
 * 可以写成下面的这样
 */
let obj = {
    p: [
        'hello',
        {
            y: `world`
        }
    ]
}
let { p, p: [x, { y }] } = obj;

/**
 * 接下来解构嵌套赋值的例子
 */
let obj = {};
let arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });
obj // {prop:123}
arr // [true]

/**
 * 注意，对象的解构赋值可以取到继承的属性
 */
const obj1 = {};
const obj2 = { foo: "bar" };
Object.setPrototypeOf(obj1, obj2);
const { foo } = obj1;
foo //bar

/**
 * 这里，默认值和数组的默认值一样，对象的属性严格等于undefined才会
 * 使默认值生效
 */
var { x = 3 } = { x: undefined };
x // 3

var { x = 3 } = { x: null };
x // null

/**
 * 为了理解上面的嵌套赋值的例子，以下是原因还有实例代码
 * JavaScript 引擎会将{x}理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，
 * 避免 JavaScript 将其解释为代码块，才能解决这个问题。
 */
let x;
({ x } = { x: 1 });

/**
 * 由于数组的本质是特殊的对象，因此我们可以对数组进行对象属性的解构
 */
let arr = [1, 2, 3];
let { 0: first, [arr.length - 1]: last } = arr;
first //1
last //3

/**
 * 字符串也可以解构赋值
 */
const [a, b, c, d, e] = 'hello';
// a h  b w  c l  d l  e o

/**
 * 类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值
 */
let { length: len1 } = [1, 2, 3, 4, 6];
let { length: len2 } = 'helloworld';
len1 //5
len2 //9

/**
 * 解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。
 */
let { toString: s } = 123;
s === Number.prototype.toString // true
let { toString: s } = true;
s === Boolean.prototype.toString // true

/**
 * 函数参数的解构赋值
 */
function add([x, y]) {
    return x + y;
}
add(1, 2); // 3
//上面add的参数是一个数组，但是在传入参数的那一刻，数组参数就被解构成为变量x y

/**
 * 接下来写一个将对象转为数组的例子
 */
function move({ x = 0, y = 0 } = {}) {
    return [x, y];
}
move(); // [0,0]
move({ x: 3, y: 4 }); //[3,4]
move({}); //[0,0]
move({ x: 3 }); // [3,0]

/**
 * 下面的代码，将会得到不一样的效果
 */
function move({ x, y } = { x: 0, y: 0 }) {
    return [x, y];
}

move({ x: 3, y: 8 }); // [3, 8]
move({ x: 3 }); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
//介于这两个例子，一定要清楚哪个变量有默认值

/**
 * 用途1：交换变量值
 */
let x = 1;
let y = 2;
[x, y] = [y, x];

/**
 * 用途2：从函数返回多个值
 */
// 返回一个数组
function example() {
    return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
    return {
        foo: 1,
        bar: 2
    };
}
let { foo, bar } = example();

/**
 * 用途3：函数参数的定义
 */
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);
// 参数是一组无次序的值
function f({ x, y, z }) { ... }
f({ z: 3, y: 2, x: 1 });

/**
 *用途4：提取json数据
 */
let jsonData = {
    id: 42,
    status: "OK",
    data: [867, 5309]
};
let { id, status, data: number } = jsonData;
console.log(id, status, number);

/**
 * 用途5：函数参数的默认值
 */

/**
 * 用途6：遍历Map结构
 */
let map = new Map();
map.set('first', 'hello');
map.set('second', 'world');
for (let [key, value] of map) {
    console.log(`${key} is ${value}`);
}
//如果只想获取键名，或者只想获取键值，可以写成下面这样
// 获取键名
for (let [key] of map) {
    // ...
}
// 获取键值
for (let [, value] of map) {
    // ...
}

/**
 * 输入模块的指定方法
 */
const { SourceMapConsumer, SourceNode } = require("source-map");