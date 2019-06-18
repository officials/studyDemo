/**
 * ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值
 */
const a = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => a.add(x));
console.log(a); //Set(4) {2, 3, 5, 4}

/**
 * Set函数接收一个数组作为参数，用来初始化
 */
//example1:
const set = new Set([1, 2, 2, 4, 5, 5, 6]);
[...set] //[1,2,4,5,6]
//example2：
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size(); //5
//example3:
const set = new Set(document.querySelectorAll('div'));
set.size();//56

/**
 * 下面展示一个数组去重的例子
 */
const arr = [1, 2, 3, 4, 5, 4, 3, 6, 7, 8];
[...new Set(arr)]; //[1, 2, 3, 4, 5, 6, 7, 8]

/**
 * 下面是Set对象的一些例子，主要区别是NaN等于自身，1不等于'1'
 */
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}

/**
 * Set结构有以下属性
 */
//Set.prototype.constructor:构造函数，默认就是Set对象
//Set.Prototype.size: 返回Set实例的成员总数

/**
 * Set实例分为两大类：操作方法和遍历方法
 * 下面先展示4个操作方法：
 */
// add(value):添加某个值，返回Set结构本身
// delete(value):删除某个值，返回一个布尔值，表示是否删除成功
// has(value):返回一个布尔值，表示该值是否是Set成员
// clear():清除所有成员，没有返回值
var s = new Set();
s.add(1).add(2);
s.size();//2
s.has(1);//true
s.has(3);//false
s.delete(1);//true
s.has(1);//false

/**
 * 下面是一个对比例子，看看是否包含该键名
 */
//对象的写法：
const properties = {
    height: 1,
    width: 2
};
if (properties['height']) {
    //...
}
//Set写法：
const properties = new Set();
properties.add({ 'width': 1 });
properties.add({ 'height': 2 });
if (properties.has(someName)) {
    //...
}

/**
 * Array.from方法可以将Set解构转为数组
 */
var set = new Set([2, 3, 4]);
console.log(Array.from(set)); //[2, 3, 4]

/**
 * 接下来我们看遍历操作
 * Set解构有以下四个遍历方法
 * keys():返回键名的遍历器
 * values():返回键值的遍历器
 * entries():返回键值对的遍历器
 * forEach():使用回调函数遍历每个成员
 */
let set = new Set(['red', 'green', 'blue']);
for (let key of set.keys()) {
    console.log(ket);// red green blue
};
//由于Set解构没有键名，只有键值，所以keys()方法和values()方法一致
for (let item of set.values()) {
    console.log(item);
};
// red
// green
// blue
for (let item of set.entries()) {
    console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]

/**
 * Set解构的实例默认可遍历，默认遍历器就是他的values()方法
 */
Set.prototype.values === Set[Symbol.iterator] //true
//这就意味着，可以省略values()方法，使用for of就可以
let set = new Set(['red', 'green', 'blue']);
for (let x of set) {
    console.log(x);
}
// red
// green
// blue

/**
 * forEach()
 * 与普通数组一样，Set解构也有forEach方法
 */
Set.prototype.forEach === Array.prototype.forEach //false
//无意义，因为都是挂载到了不用的对象上
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ':' + value));
// 1 : 1
// 4 : 4
// 9 : 9

/**
 * 扩展运算符也可以遍历Set结构
 */
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']

/**
 * 当然，数组的map和filter也可以直接用于Set
 */
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}
let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}

/**
 * 下面，将实现并集，交集和差集
 */
const a = new Set([1, 2, 3]);
const b = new Set([1, 2, 3, 4, 5, 6, 7]);
//并集：
let arr1 = [...new Set(...a, ...b)];
//差集：
let arr2 = new Set([...a].filter(t => !b.has(t)));
//交集：
let arr3 = new Set([...a].filter(t => b.has(t)));

/**
 * 同步改变原来的 Set 结构，目前没有直接的方法，但有两种变通方法。
 * 一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；
 * 另一种是利用Array.from方法。
 */
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6
// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6

/**
 * weakSet
 * 结构与Set类似，也是不重复的集合，主要有以下俩个区别
 * 1.WeakSet的成员只能是对象，而不能是其他类型的值
 * 2.WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用
 * 也就是说，如果其他对象不再引用该对象，那么垃圾回收机制自动回收该对象
 * 所占用的内存，不考虑该对象还存在于WeakSet中
 * 基于以上的特点，WeakSet的成员是不适合引用的，因为它随时会消失，
 * weakSet有多少成员，取决于垃圾回收机制有没有运行，而垃圾回收机制何时运行是
 * 不可测的，因此es6规定WeakSet不可遍历
 */

/**
 * WeakSet是一个构造函数，可以使用new命令
 */
const ws = new WeakSet();
/**
 * WeakSet可以接受一个数组或者类似数组的对象作为参数(任何具有Iterable接口的对象)
 * 该组的所有成员，都会自动成为WeakSet实例对象的成员
 */
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
//WeakSet{[1,2],[3,4]}
//注意：a数组的成员成为WeakSet的成员，而不是数组a本身，这意味着，数组的成员只能是对象
const b = [1, 2];
const ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)
//上面代码中，因为b的成员不是对象，所以会抛出异常，注意是成员，不是变量本身

/**
 * WeakSet有以下三个方法：
 * WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
 * WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
 * WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。
 */
const ws = new WeakSet();
const obj = {};
const foo = {};
ws.add(window);
ws.add(obj);
ws.has(window); // true
ws.has(foo);    // false
ws.delete(window);
ws.has(window);    // false

/**
 * 注意WeakSet没有size和forEcch属性，WeakSet不允许遍历
 */

/**
 * 下面是WeakSet的另一个例子
 */
const foos = new WeakSet();
class Foo {
    constructor() {
        foos.add(this);
    }
    methed() {
        if (!foos.has(this)) {
            throw new TypeError('Foo.prototype.methed 只能在实例对象上使用');
        }
    }
}
//以上代码实现了对类实例的引用，不会被计入回收机制，再删除实例的时候，不用考虑
//foos，也不会出现内存泄漏

/**
 * JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），
 * 但是传统上只能用字符串当作键。这给它的使用带来了很大的限制
 */
const data = {};
const element = document.getElementById('mydiv');
data[element] = 'metadata';
data['[object HTMLDivElement]'] //’meatdata‘;
//上面代码原意是将一个 DOM 节点作为对象data的键，但是由于对象只接受字符串作为键名，
//所以element被自动转为字符串[object HTMLDivElement]。

/**
 * 为了解决上面的问题，es6提供了Map结构，它类似对象，也是键值对的集合，
 * 但是键的范围不限与字符串
 */
const m = new Map();
const o = { p: 'hello' };
m.set(o, 'content');
m.get(o); //'content'
m.has(o) // true
m.delete(o) // true
m.has(o) // false

/**
 * 上面的例子展示了如何向Map添加成员，作为构造函数，Map也可以接受一个数组作为参数
 */
const map = new Map([
    ['name', 'zhangsan'],
    ['title', 'author']
]);
map.size //2
map.has('name');//true
map.get('name'); //zahngsan

/**
 * Map构造函数接收数组作为参数，实际执行下面的算法
 */
const items = [
    ['name', 'zhangsan'],
    ['title', 'author']
];
const map = new Map();
items.forEach(([key, value]) => map.set(ket, value));

/**
 * Set和Map都可以用来生成新的Map
 */
const set = new Set([
    ['foo', 1],
    ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1
const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3

/**
 * 如果对一个键多次赋值，后面的键值将覆盖前面的值
 */
const map = new Map();
map
    .set(1, 'aaa')
    .set(1, 'bbb');
map.get(1) // "bbb"

/**
 * 如果读取一个未知的键，返回undefined
 */
new Map().get('wervgg'); //undefined

/**
 * 下面这段代码，因为['a']是两个内存地址，所以无法读取，返回undefined
 */
const map = new Map();
map.set(['a'], 555);
map.get(['a']) // undefined

/**
 * Map实例的属性和方法
 * 1.size属性
 * 2.set(key,value)
 * 3.get(key)
 * 4.has(key)
 * 5.delete(key)
 * 6.clear()
 */

/**
 * Map结构的遍历方法
 * 1.keys() 返回键名的遍历器
 * 2.values() 返回键值的遍历器
 * 3.entries() 返回所有成员的遍历器
 * 4.forEach() 遍历Map所有成员
 */
//需要注意的是，Map遍历的顺序就是插入的顺序
const map = new Map(
    [
        ['F', 'no'],
        ['T', 'yes']
    ]
);
for (let key of map.keys()) {
    console.log(key); // "F" "T"
}
for (let value of map.values()) {
    console.log(value);
}
// "no"
// "yes"
for (let item of map.entries()) {
    console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"
//或者
for (let [key, value] of map.entries()) {
    console.log(key, value);
}
// "F" "no"
// "T" "yes"
//等同于使用map.entries()
for (let [key, value] of map) {
    console.log(key, value);
}
// "F" "no"
// "T" "yes"

/**
 * 上面例子，表示Map结构的默认遍历器接口
 */
map(Symbol.iterator) === map.entries //true

/**
 * forEcch方法还接受第二个参数，用来绑定this
 */
const reporter = {
    report: function (key, value) {
        console.log(`${key} ==>${value}`);
    }
}
map.forEach((key, value, map) => this.report(key, value), reporter);

/**
 * 以下是Map与其他数据结构互相转换
 */
//Map转为数组，最简单的就是使用...扩展运算符
const map = new Map()
    .set(true, 7)
    .set({ foo: 3 }, ['abc']);
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
//数组转为Map
new Map([
    [true, 7],
    [{ foo: 3 }, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
//Map转为对象
//如果Map中的键名都是字符串，那么将无损的转为对象，如果有，那么存在
//非字符串的键名，那么这个键名就会被转为字符串
function maptoobject(strMap) {
    let obj = Object.create(null);
    for (let [key, value] of strMap) {
        obj[key] = value;
    }
    return obj;
}
const map = new Map()
    .set('yes', true)
    .set('no', false);
maptoobject(map);
//{ yes: true, no: false }
//对象转Map
const obj = {
    name: 'duan',
    age: 24
};
function objToMap(obj) {
    let strMap = new Map();
    for (let key of Object.keys(obj)) {
        strMap.set(key, obj[key]);
    }
    return strMap;
}
objToStrMap({ yes: true, no: false })
// Map {"name" => 'duan', "age" => 24}
//Map转为JSON
function mapToArrayJson(map) {
    return JSON.stringify([...map]);
}
let myMap = new Map().set(true, 7).set({ foo: 3 }, ['abc']);
mapToArrayJson(myMap);
// '[[true,7],[{"foo":3},["abc"]]]'
//JSON转为Map
function jsonToMap(json) {
    let obj = JSON.parse(json);
    let map = new Map();
    for (let key of Object.keys(obj)) {
        map.set(key, obj[key]);
    }
    return map;
}
let json = '{ "name": "duan", "age": 24 }';
jsonToMap(json);
//Map(2) {"name" => "duan", "age" => 24}

/**
 * WeakMap和WeakSet的作用差不多
 * WeakMap和Map的区别有两点：
 * 1、WeakMap只接受对象作为键名
 * 2、WeakMap键名所指向的对象，不计入垃圾回收机制
 */
//WeakMap里，size、forEach、clear方法都不存在

/**
 * WeakMap的实例
 * 通过node手动进行垃圾回收
 */
//首先，打开node执行以下命令
node--expose - gc
//然后执行以下代码
globalThis.gc() //手动执行垃圾回收

process.memoryUsage()//查看内存占用的初始状态，当前占用内存大约4m
// {
//     rss: 21106688,
//     heapTotal: 7376896,
//     heapUsed: 4153936,
//     external: 9059
// }
let vm = new WeakMap();
let key = new Array(5 * 1024 * 1025); //新建变量，指向一个5*1024*1025的数组
vm.set(key, 1);
process.memoryUsage() //这时内存占用已经到了45m
key = null; //清除变量对数组的引用
globalThis.gc() //再次执行垃圾回收
process, memoryUsage()//占用内存变回4m左右
//可以看到WeakMap的键名引用没有阻止gc对内存的回收

/**
 * WeakMap的用途
 */
//WeakMap应用的典型场合就是DOM节点作为键名
let myElement = document.getElementById('logo');
let myWeakMap = new WeakMap();
myWeakMap.set(myElement, { timesClicked: 0 });
myElement.addEventListener('click', function () {
    let logoData = myWeakMap.get(myElement);
    logoData.timesClicked++;
}, false)
//上面代码每当发生点击事件，就会更新一下状态，一旦这个DOM节点被删除，该状态就会自动消失
//不会存在内存泄漏的问题

/**
 * WeakMap的另一个用处就是部署私有属性
 * 下面这个例子，个人理解就是当删除引用类实例后，class里的构造函数参数也会随之消失
 * 不会继续占用内存
 * 后期如果发现理解错误，也会随即改掉
 */
const _counter = new WeakMap();
const _action = new WeakMap();
class Countdown {
    constructor(counter, action) {
        _counter.set(this, counter);
        _action.set(this, action);
    }
    dec() {
        let counter = _counter.get(this);
        if (counter < 1) return;
        counter--;
        _counter.set(this, counter);
        if (counter === 0) {
            _action.get(this)();
        }
    }
}
const c = new Countdown(2, () => console.log('实例调用次数两次,函数执行'));
c.dec();
c.dec();//’实例调用次数两次,函数执行‘
