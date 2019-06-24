/**
 * 遍历器(Iterator)就是一种集合的机制，为不同的数据结构提供统一的访问机制
 * 任何数据结构只要部署Iterator就可以完成遍历操作（即依次处理该数据结构的所有成员）
 * 主要的数据结构有4中，Array,Object,Set,Map
 */

/**
 * iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；
 * 二是使得数据结构的成员能够按某种次序排列；
 * 三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。
 */

/**
 * Iterator的遍历过程是这样的：
 * 1.创建一个指针对象，指向当前数据结构的起始位置，也就是说，遍历器对象本质上就是一个指针对象
 * 2.第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员
 * 3.第二次调用指针对象的next方法，指针就指向数据解构的第二个成员
 * 4.不断调用指针对象的next方法，直到它指向数据结构的结束位置
 */

/**
 * 每一次调用next方法，都会返回数据结构的当前成员的信息，具体来说
 * 就是返回一个包含value和done两个属性的对象，其中
 * value是当前成员的值，done属性是一个布尔值，表示遍历是否结束
 */

var it = makeIterator(['a', 'b']);
it.next(); //{ value: "a", done: false }
it.next(); //{ value: "b", done: false }
it.next(); //{ value: undefined, done: true }
function makeIterator(array) {
    var nextIndex = 0;
    return {
        next: function () {
            return nextIndex < array.length ?
                { value: array[nextIndex++], done: false } :
                { value: undefined, done: true };
        }
    }
}

/**
 * 默认Iterator接口
 * 就是为了所有数据结构，提供了一种统一的访问机制，即for of 循环
 * 当使用for of 循环遍历某种数据结构时，该循环会自动去找Iterator接口
 * es6规定，默认的Iterator接口部署在数据结构的Symbol.iterator属性，
 * 或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”
 * Symbol.iterator属性本身就是一个函数，就是当前数据结构默认的遍历器生成函数，
 * 执行这个函数，就会返回一个遍历器，至于Symbol.iterator，它是一个表达式。返回Symbol
 * 对象的iterator属性
 */
const obj = {
    [Symbol.iterator]: function () {
        return {
            next: function () {
                return {
                    value: 1,
                    done: true
                }
            }
        }
    }
};

/**
 * es6的有些数据结构原生必备Iterator接口（比如数组），即不用任何处理，就可以被for of循环遍历
 * 原因在于，这些数据结构原生部署了Symbol.iterator属性
 * 另外一些数据结构没有（比如对象），部署了Symbol.iterator属性的数据结构，就称为部署了遍历器接口，就会返回一个遍历器对象
 */

/**
 * 原生必备Iterator接口的数据结构如下：
 * Array
 * Map
 * Set
 * String
 * TypedArray
 * 函数的arguments对象
 * NodeList对象
 */

/**
 * 以下是数组的Symbol.interator属性
 */
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();
iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }

/**
 * 对象之所以没有默认部署Iterator接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不正确的，需要开发者手动指定
 * 本质上，遍历器就是一种线性处理，对于任何非线性处理的数据结构，部署遍历器接口，
 * 就等于部署一种线性处理
 */

/**
 * 一个对象如果要具备可被for of循环调用的Iterator接口，就必须在Symbol.iterator的
 * 属性上部署遍历器生成方法（原型链上的对象具有该方法也可）
 */
class RangeIterator {
    constructor(start, stop) {
        this.value = start;
        this.stop = stop;
    }
    [Symbol.iterator]() { return this; }
    next() {
        var value = this.value;
        if (value < this.stop) {
            return { value: value, done: false };
        }
        return { value: undefined, done: true };
    }
}
function range(start, stop) {
    return new RangeIterator(start, stop);
}
for (var value of range(0, 3)) {
    console.log(value); // 0 1 2
}

/**
 * 下面是通过遍历器实现指针结构的例子
 */
function Obj(value) {
    this.value = value;
    this.next = null;
}
Obj.prototype[Symbol.iterator] = function () {
    var iterator = { next: next };
    var current = this;
    function next() {
        if (current) {
            var value = current.value;
            current = current.next;
            return { done: false, value: value };
        } else {
            return { done: true };
        }
    }
    return iterator;
}
var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);
one.next = two;
two.next = three;
for (var i of one) {
    console.log(i); // 1, 2, 3
}

/**
 * 下面是一个为对象添加Iterator接口的例子
 */
let obj = {
    data: ['hello', 'world'],
    [Symbol.iterator]() {
        const self = this;
        let index = 0;
        return {
            next() {
                if (index < self.data.length) {
                    return {
                        value: self.data[index++],
                        done: false
                    }
                } else {
                    return {
                        value: undefined,
                        done: true
                    }
                }
            }
        }
    }
};

/**
 * 对于类似数组的对象，部署Iterator接口，有一个简洁方便的方法，就是Symbol,iterator
 * 方法直接引用数组的Iterator接口
 */
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
//或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];
[...document.querySelectorAll('div')]  //可以执行了

/**
 * 下面是另一个类似数组的对象调用Symbol.iterator方法的例子
 */
let iterable = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
    console.log(item); // 'a' 'b' 'c'
}
//注意，普通对象部署数组的Symbol,iterator并无效果

/**
 * 调用Iterator接口的场合
 */

/**
 * 1.解构赋值
 * 对数组的Set结构进行解构赋值时，会默认调用Symbol.iterator方法
 */
let set = new Set().add('a').add('b').add('c');
let [x, y] = set;
// x='a'   y='b'
let [first, ...rest] = set;
// first='a'  rest=['b','c']

/**
 * 2.扩展运算符,也会默认调用Iterator接口
 */
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']
// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
//实际上，只要某个数据结构部署了Iterator接口，就可以对它进行扩展运算符，将其转为数组
let arr = [...iterable];

/**
 * 3.yield*
 * yield*后面跟的是一个可遍历的结垢，它会调用该结构的遍历器接口
 */
let generator = function* () {
    yield 1;
    yield* [2, 3, 4];
    yield 5;
}
var iterator = generator();
iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }

/**
 * 4.其他场合
 * 由于数组的遍历会调用遍历器的接口，所以任何接收数组作为参数的场合，
 * 其实都调用了遍历器接口，下面是一些例子：
 * for...of
 * Array.from()
 * Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
 * Promise.all()
 * Promise.race()
 */

/**
 * 字符串是一个类似数组的对象，也具有原生的Iterator接口
 */
var something = 'hi';
typeof something[Symbol.iterator] //function
var iterator = something[Symbol.iterator]();
iterator.next()  // { value: "h", done: false }
iterator.next()  // { value: "i", done: false }
iterator.next()  // { value: undefined, done: true }

/**
 * 可以覆盖原生的Symbol.iterator方法，达到修改遍历器行为的目的
 */
var str = new String("hi");
[...str] // ["h", "i"]
str[Symbol.iterator] = function () {
    return {
        next: function () {
            if (this._first) {
                this._first = false;
                return { value: "bye", done: false };
            } else {
                return { done: true };
            }
        },
        _first: true
    };
};
[...str] // ["bye"]
str // "hi"

/**
 * Iterator接口与Generator函数
 */
let myIterable = {
    [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
        yield 3;
    }
}
[...myIterable]; //[1,2,3]
//或者可以简写成喜下面的写法
let obj = {
    *[Symbol.iterator]() {
        yield 'hello';
        yield 'world';
    }
};
for (let x of obj) {
    console.log(x);
}
// "hello"
// "world"

/**
 * 遍历器对象的 return()，throw() 
 * return方法的使用场合是，如果for...of循环提前退出
 * （通常是因为出错，或者有break语句），就会调用return方法。
 * 如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return方法
 */
function readLinesSync(file) {
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    return { done: false };
                },
                return() {
                    file.close();
                    return { done: true };
                }
            }
        }
    }
}
//下面这两种情况，会触发上面的return方法
//情况1：
for (let line of readLinesSync(fileName)) {
    console.log(line);
    break;
}
// 情况2：
for (let line of readLinesSync(fileName)) {
    console.log(line);
    throw new Error();
}

/**
 * for...of 循环
 * 一个数据结构只要部署了Symbol.iterator属性，就被视为具有 iterator 接口，
 * 就可以用for...of循环遍历它的成员。也就是说，
 * for...of循环内部调用的是数据结构的Symbol.iterator方法。
 */


/**
 * 数组原生具备iterator接口，以下代码可以证明
 */
const arr = ['red', 'green', 'blue'];
for (let v of arr) {
    console.log(v);// red green blue
}
const obj = {};
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr);
for (let v of obj) {
    console.log(v); // red green blue
}

/**
 * Set和Map结构也原生具有Iterator接口，可以直接for of 循环
 */
var engines = new Set(['Gecko', 'Trident', 'Webkit', 'Webkit']);
for (let e of engines) {
    console.log(e); //'Gecko' 'Trident' 'Webkit'
}
var es6 = new Map();
es6.set("edition", 6);
es6.set("committee", "TC39");
es6.set("standard", "ECMA-262");
for (let [name, value] of es6) {
    console.log(name + ":" + value);
}
// edition: 6
// committee: TC39
// standard: ECMA-262

/**
 * 计算生成的数据结构
 * entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值；对于 Set，键名与键值相同。Map 结构的 Iterator 接口，默认就是调用entries方法。
 * keys() 返回一个遍历器对象，用来遍历所有的键名。
 * values() 返回一个遍历器对象，用来遍历所有的键值。
 */
//这三种方法调用后生成的遍历器，所遍历的都是计算后生成得我数据结构
let arr = ['a', 'b', 'c'];
for (let pire of arr.entries()) {
    console.log(pire);
}
// [0, 'a']
// [1, 'b']
// [2, 'c']

/**
 * 类似数组的对象有很多，下面举例for of循环字符串、Dom Nodelist对象、arguments对象的例子
 */
//字符串
let str = 'hello';
for (let s of str) {
    console.log(s);// h e l l o
}
//DOM Nodelist对象
let paras = document.querySelectorAll("p");

for (let p of paras) {
    p.classList.add("test");
}
//arguments对象
function printArgs() {
    for (let x of arguments) {
        console.log(x);
    }
}
printArgs('a', 'b');
// 'a'
// 'b'

/**
 * 并不是所有类似数组的对象都具有Iterator接口，一个简单的解决办法就是
 * 利用Array.from()方法转为数组
 */
let arrayLike = { length: 2, 0: 'a', 1: 'b' };
// 报错
for (let x of arrayLike) {
    console.log(x);
}
// 正确
for (let x of Array.from(arrayLike)) {
    console.log(x);
}

/**
 * 对于普通的对象，for of 结构不能直接使用，会报错，必须部署了
 * Iterator接口才能使用
 */
let es6 = {
    edition: 6,
    committee: "TC39",
    standard: "ECMA-262"
};
for (let e in es6) {
    console.log(e);
}
// edition
// committee
// standard
for (let e of es6) {
    console.log(e);
}
// TypeError: es6[Symbol.iterator] is not a function

/**
 * 对于上面的困惑，一种解决办法就是利用Object.values()
 * 另一种办法就是Generator函数将对象重新包装一下
 */
function* (obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}
for (let [key, value] of entries(obj)) {
    console.log(key, '->', value);
}
  // a -> 1
  // b -> 2
  // c -> 3