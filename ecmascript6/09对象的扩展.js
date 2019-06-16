/**
 * es6允许属性写入变量和函数，作为对象的属性和方法，这样使得书写更加简洁
 */
const foo = 'bar';
const obj = { foo };
console.log(obj); //{"foo":"bar"}

/**
 * 除了简写属性，方法也可以简写
 */
const obj = {
    init() {

    },
    methed() {

    }
}

/**
 * commomJs模块输出一组变量，也很适合简洁写法
 */
module.exports = { getItem, setItem, clear };
// 等同于
module.exports = {
    getItem: getItem,
    setItem: setItem,
    clear: clear
};

/**
 * 属性赋值器（setter）和取值器（getter）
 */
const cart = {
    _name: "duan",
    get name() {
        console.log('你对我有意思');
        return this._name;
    },
    set name(value) { //Setter must have exactly one formal parameter.
        console.log('不准动我');
        this._name = 'duan is good';
    }
}

/**
 * 属性的可枚举性和遍历
 * 对象的每个属性都有一个描述对象（descriptor）同来控制该属性的行为
 */
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, foo);
// configurable: true
// enumerable: true
// value: 123
// writable: true

/**
 * 属性的遍历，一共有5种
 * 1.for in 循环遍历自身和继承性的可枚举属性（不包含symbol属性）
 * 2.Object.keys(obj) 返回一个数组,包含对象自身的（不含继承）所有课枚举属性（不包含symbol）
 * 3.Object.getOwnPrototypertyNames(obj) 返回一个数组，包含对象自身的所有属性（不包含symbol，但是包括不可枚举属性）的键名
 * 4.Object.getOwmPrototypertySymbols(obj) 返回一个数组，包含对象自身的所有symbol属性的键名
 * 5.Reflect.ownKeys(obj) 返回一个数组，包含对象自身的所有键名，不管键名是symbol还是是否可枚举
 */

/**
 * super关键字
 * es6新增关键字，指向当前对象原型对象
 */
const proto = {
    foo: "hello"
}
const obj = {
    foo: 'world',
    find() {
        return super.foo
    }
}
Object.setPrototypeOf(obj, proto);
obj.find();
//JavaScript引擎内部，super.foo等同于Object.getPrototypeOf(this).foo

/**
 * 解构赋值
 */
let { x, y, ...z } = { x: 1, y: 2, z: 3, o: 4, p: 5 };
x //1
y //2
z //{z:3,o:4,p:5}