/**
 * 扩展运算符（...）
 */

/**
 * 扩展运算符可以展开数组，所以不需要apply方法
 */
//es5的写法
function f(x, y, z) {
    //...
    console.log(x, y, z);
}
var args = [2, 3, 4];
f.apply(null, args);
//es6
function f(...arr) {
    //...
    console.log(x, y, z);
}
var args = [2, 3, 4];
f(...args)
//再看一个Math.max方法
//es5:
Math.max.apply(null, [12, 4, 78])
//es6:
Math.max(...[12, 4, 78])

/**
 * 接下来再看一个push函数的例子
 */
//es5:
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
Array.prototype.push.apply(arr1, arr2);
//arr1 [1,2,3,4,5,6]
//es6:
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
arr1.push(...arr2);

/**
 * 数组的复制
 */
const a1 = [1, 2];
const a2 = a1;
a2[0] = 5;
a1 //[5,2]
//上面的代码，a2并不是a1的克隆，而是复制了底层数据结构的指针
//所以修改a2会导致a1的变化
//要想不改变数组，可以用变通方法来复制数组
const a1 = [1, 2];
const a2 = a1.concat();
//当然，扩展运算符提供了更加便捷的方法
const a1 = [1, 2];
const a2 = [...a1];
//或者
const [...a2] = a1;

/**
 * 与结构赋值相结合
 */
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]
const [first, ...rest] = [];
first // undefined
rest  // []
const [first, ...rest] = ["foo"];
first  // "foo"
rest   // []

/**
 * 扩展运算符也可以将字符串转为真正的的数组
 */
[...'hello']
//["h", "e", "l", "l", "o"]

/**
 * 下面这个例子实现了iterator接口，使得
 */
Number.prototype[Symbol.iterator] = function* () {
    let i = 0;
    let num = this.valueOf();
    while (i < num) {
        yield i++;
    }
}
console.log([...5]); //[0, 1, 2, 3, 4]
//如果理解不了，请查看iterator接口

/**
 * 当然，Map和Set结构，还有generator函数都可以使用扩展运算符
 */
let map = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
]);
let arr = [...map.keys()];
arr //[1,2,3]
//再看下面这个generator函数
const go = function* () {
    yield 1;
    yield 2;
    yield 3;
}
[...go()]

/**
 * Array.from()
 * 可以将类似数组的对象和可遍历（iterable）的对象转换为数组
 */
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
//es5 的写法
var arr1 = [].slice.call(arrayLike);
//es6 的写法
let arr1 = Array.from(arrayLike);

/**
 * 在实际应用中，我们也可以Array.from()
 */
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
    return p.textContent.length > 100;
});

/**
 * Array.from()的第二个参数
 * 第二个参数用来对每个元素进行处理，将处理后的值放入返回的数组
 */
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);
Array.from([1, 2, 3], (x) => x * x)

/**
 * Array.of()
 * 该放用于将一组值转换为数组
 */
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1

/**
 * copyWithin()
 * 将指定位置的成员复制到其他位置（会覆盖原有成员），
 * 然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
 */
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]
// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]
// 将3号位复制到0号位
[].copyWithin.call({ length: 5, 3: 1 }, 0, 3)
// {0: 1, 3: 1, length: 5}
// 将2号位到数组结束，复制到0号位
let i32a = new Int32Array([1, 2, 3, 4, 5]);
i32a.copyWithin(0, 2);
// Int32Array [3, 4, 5, 4, 5]
// 对于没有部署 TypedArray 的 copyWithin 方法的平台
// 需要采用下面的写法
[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);

/**
 * find()和findIndex()
 * 找出第一个符合天剑的数组成员
 */
//两者的区别是，find()会返回第一个符合条件的值
//而findIndex()会返回第一个符合条件的下标
var zz = arr.find(function (value) { return value > 5 });

/**
 * 这两个方法都接收第二个参数
 * 用来绑定回调函数this的对象
 */
function f(v) {
    return v > this.age;
}
let person = { "name": "ddd", "age": 24 };
[2, 5, 20, 25, 78].find(f, person);

/**
 * 数组实例的entries(),keys(),values()
 * ebtries()是对键值对的遍历
 * keys()是对键名的遍历
 * values() 是对键值得遍历
 */
for (let index of ['a', 'b'].keys()) {
    console.log(index);
}
// 0 1
for (let value of ['a', 'b'].values()) {
    console.log(value);
}
// ’a‘ 'b'
for (let [index, value] of ['a', 'b'.entries()]) {
    console.log(index, value);
}
// 0 'a'
// 1 'b'

/**
 * 数组实例的includes()
 * 该方法返回一个布尔值，表示某个数组是否包含该值
 */
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
//includes()还可以设置第二个参数，第二个参数表示搜索的起始位置
//如果第二个参数是负数，则表示倒数的位置
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true

/**
 * 数组实例的flat(),flatMap()
 * Array.prototype.flat()用于将数组扁平化，可以将多层嵌套数组“拉平”
 */
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]

/**
 * flat()默认拉平一层，该方法可以传入参数
 * Infinity  表示不管有多少层，都会将数组扁平化
 */
[1, 2, [3, [4, 5]]].flat()
// [1, 2, 3, [4, 5]]
[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]
[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]

/**
 * flatMap()方法对原数组的每个成员执行一个函数，相当于map()后再执行flat()方法
 * 该方法返回一个新数组，不改变原数组
 */
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
