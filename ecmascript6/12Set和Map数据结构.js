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
