/**
 * 举个例子，比如我们在平时开发过程中用了别人写的一个对象，想为这个对象添加一些新的方法或属性
 * 但是新的方法名可能与现有的方法名冲突，为了解决这个问题，es6引入了Symbol
 * Symbol是一种新的数据类型，是继5大基本数据类型后的第六个基本数据类型，代表独一无二
 */
let a = Symbol();
typeof a //Symbol

/**
 * symbol函数接收一个字符串作为参数，表示对symbol实例的描述
 */
let s1 = Symbol('foo');
let s2 = Symbol('bar');
s1 //Symbol(foo) 
s2 //Symbol(bar)
s1.toString() //"Symbol(foo)"
s2.toString() // "Symbol(bar)"

/**
 * 要注意的是，Symbol函数参数的值只是对当前Symbol的描述
 */

/**
 * Symbol.prototype.description
 * 返回当前symbol描述
 */
let ss = Symbol('desc');
ss.description; //desc

/**
 * 作为属性名的Symbol
 */
let mysymbol = Symbol();
//1:
let a = {};
a[mysymbol] = 'hello';
//2:
let a = {
    [mysymbol]: 'hello'
};
//3:
let a = {};
Object.defineProperty(a, mysymbol, { value: 'hello' });
//以上写法都会得到同样的结果
a[mysymbol] //'hello'
//注意：Symbol值作为对象的属性，不能用点运算符

/**
 * 下面这种情况，属性只是简单的字符串，并非Symbol属性值
 */
let s = Symbol();
a.s = 'hello';
a[s] //undefined
a['s'] //hello

/**
 * Symbol也可以定义一些常量，保证这组常量都是不相等的
 */
const log = {};
log.levels = {
    debug: Symbol('debug'),
    info: Symbol('info')
}

/**
 * 消除魔术字符串
 * 魔术字符串指的是在代码中多次出现，与代码形成强耦合的某一个具体的字符串或者数值
 */
//下面举一个“强耦合”例子
function getArea(shape, options) {
    let area = 0;
    switch (shape) {
        case 'Triangle':
            area = 5 * options.width * options.height;
            break;
    }
    return area;
}
getArea('Triangle', { width: 100, height: 100 });
//这个例子就是典型的’魔术字符串‘，与代码形成’强耦合‘，不利于维护

/**
 * 常用的消除魔术字符串，就是把它写成变量
 */
const shapeType = {
    triangle: 'Triangle'
};
function getArea(shape, options) {
    let area = 0;
    switch (shape) {
        case shapeType.triangle:
            area = 5 * options.width * options.height;
            break;
    }
    return area
}
getArea(shapeType.triangle, { width: 100, height: 100 });

/**
 * 如果我们将上面的例子改成Symbol，其他的地方都不用修改，并且保证了唯一性
 */
const shapeType = {
    triangle: Symbol()
}

/**
 * Symbol作为属性名，不会出现在for in、for of循环中，也不会被Object.keys(),Object.getOwnPropertyNames()
 * JSON.stringify()返回，但是它也不属于私有属性，使用Object.getOwnPropertySymbole方法可以获取对象内所有Symbol属性名
 */
//getOwnPropertySymbols方法返回一个数组，成员是当前对象所有属性名的Symbol值
const obj = {};
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'hello';
obj[b] = 'world';
const objectSymbols = Object.getOwnPropertySymbols(obj);
objectSymbols //[Symbol(a), Symbol(b)]

/**
 * 下面这个例子，Object.getOwnPropertySymbols方法与for in循环、
 * Object.getOwnPropertyNames方法进行对比
 */
const obj = {};
let foo = Symbol('foo');
Object.defineProperty(obj, 'foo', {
    value: 'foobar'
});
for (let i in obj) {
    console.log(i); //[]
}
Object.getOwnPropertyNames(obj); //[]
Object.getOwnPropertySymbols(obj); //[Symbol(foo)]

/**
 * 另外一个新的api，Reflect.ownkeys()
 * 该方法可以返回所有类型的键名，包含常规键名和Symbol键名
 */
let obj = {
    [Symbol('my_key')]: 1,
    enum: 2,
    nonEnum: 3
}
Reflect.ownKeys(obj);//["enum", "nonEnum", Symbol(my_key)]

/**
 * 由于Symbol值作为名称的属性，不会被常规方法遍历得到，我们可以利用这个属性
 * 为对象定义一些非私有的，但又希望用于内部的方法
 */
let size = Symbol('size');
class Collection {
    constructor() {
        this[size] = 0;
    }
    add(item) {
        this[this[size]] = item;
        this[size]++;
    }
    static sizeOf(instance) {
        return instance[size];
    }
}
let x = new Collection();
Collection.sizeOf(x);
x.add('foo');
Collection.sizeOf(x);
Object.keys();//[0]
Object.getOwnPropertyNames();//['0']
Object.getOwnPropertySymbols();//[Symbol(size)]

/**
 * Symbol.for()
 * 该方法接收一个参数，搜索有没有这个名称的Symbol值，如果有，则返回这个
 * Symbol的值，否则就会创建并返回一个以该字符串作为名称的Symbol的值
 */
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');
s1 === s2 //true 
//因为s1和s2都是Symbol的值，并且都是以同样的参数Symbol.for方法生成
//所以它们是同一个值

/**
 * Symbol.for与Symbol都是Symbol值，都会生成的Symbol
 * 但是Symbol会生成新的Symbol值，后者会在全局搜索，
 * 如果存在，就会在之前存在的Symbol上修改
 */
Symbol.for("bar") === Symbol.for("bar")
// true
Symbol("bar") === Symbol("bar")
// false

/**
 * Symbol.keyFor()
 * 该方法返回一个已登记的Symbol类型的key
 */
let s1 = Symbol.for('foo');
Symbol.keyFor(s1); //'foo'
let s2 = Symbol('foo');
Symbol.keyFor(s2); //undefined
//上面代码中，因为s2的Symbol的值没有登记，所以返回undefined

/**
 * 模块的SingLeton模式
 * 翻译Singleton为’独生子‘
 * SingLeton模式指的是调用一个类，任何时候返回的都是同一个实例
 */
//我们可以把实例放到顶层对象中，比如node的global
function A() {
    this.foo = 'hello';
}
if (!globalThis._foo) {
    globalThis._foo = new A();
}
module.exports = global._foo;
//然后加载上面的module
const a = require('./xxx');
console.log(a.foo); //hollo
//在上面的代码中，任何时候变量a都是Ade同一个实例

/**
 * 但是上面的代码是全局变量，任何文件都是可以修改的，会导致脚本失真
 * 为了防止这种情况，我们可以使用Symbol
 */
const FOO_KEY = Symbol.for('foo');
function A() {
    this.foo = 'hello';
}
if (!global[FOO_KEY]) {
    global[FOO_KEY] = new A();
}
module.exports = global[FOO_KEY];

/**
 * 当然，上面的global[FOO_KEY]可以被改写，
 * 为了防止这个问题发生，我们可以用Symbol生成
 */
const FOO_KEY = Symbol('foo');

/**
 * 除了自己定义的Symbol值，es6还提供了11个内置对象Symbol值
 * 以下将一一列出
 */
/**
 * 1:Symbol.hasInstance
 */
//指向一个内部的方法，当其他对象使用instanceof运算符，判断是否为该对象的实例会调用这个方法
class Myclass {
    [Symbol.hasInstance](foo) {
        return foo instanceof Array;
    }
}
[1, 2, 3] instanceof new Myclass //true
//下面是另一个例子
class Even {
    static [Symbol.hasInstance](foo) {
        return Number(foo) % 2 === 0;
    }
}
//等同于
const Even = {
    [Symbol.hasInstance](foo) {
        return Number(foo) % 2 === 0;
    }
}
1 instanceof Even //false
2 instanceof Even //true
/**
 * 2:Symbol.isConcatSpreadable
 * 返回一个布尔值，表示该对象用于Array.prototype.concat()式，是否可以展开
 * 默认为undefined
 */
let arr1 = ['a', 'b', 'c'];
['d', 'e'].concat(arr1, 'f');
arr1[Symbol.isConcatSpreadable] //undefined
let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e');//['a','b',['c','d'],'e']
//因为上面Symbol.IsConcatSpreadable置为false，所以合并时没有展开
//Symbol.IsConcatSpreadabl默认为undefined，是可以展开的
//类似数组的对象则正好相反，默认不展开，当它的Symbol.isConcatSpreadable为
//true时，才有展开效果
let obj = { length: 2, 0: 'c', 1: 'd' }
obj[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj, 'e'); // ['a', 'b', 'c', 'd', 'e']
//Symbol.isConcatSpreadable属性也可以定义在类里
//下面再看一个Object.isConcatSpreadable用在类里的例子
class A1 extends Array {
    constructor(args) {
        super(args);
        this[Symbol.isConcatSpreadable] = true;
    }
}
class A2 extends Array {
    constructor(args) {
        super(args);
    }
    get [Symbol.isConcatSpreadable]() {
        return false;
    }
}
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
[1, 2].concat(a1, a2); //[1, 2, 3, 4, [5, 6]]

/**
 * Symbol.species
 * 指向一个构造函数，创建衍生对象时，会使用该属性
 */
class Myarray extends Array {
}
const a = new Myarray(1, 2, 3);
const b = a.map(x => x);
const c = a.filter(t => t >= 1);
b instanceof Myarray; //true
c instanceof Myarray; //true
//上面代码中，因为Myarray继承了Array,a是Myarray的实例，b和c是a衍生的对象
//所以b和c既是Array的实例，也是Myarray的实例
//为了解决上面这个问题，我们使用Symbol.species
class Myarray extends Array {
    get [Symbol.species]() {
        return Array;
    }
}
//现在，我们再来看前面的例子：
class Myarray extends Array {
    static get [Symbol.species]() {
        return Array;
    }
}
const a = new MyArray();
const b = a.map(x => x);
b instanceof MyArray // false
b instanceof Array // true
//再来看一个例子：
class T1 extends Promise {

}
class T2 extends Promise {
    static get [Symbol.species]() {
        return Promise;
    }
}
new T1(t => t).then(v => v) instanceof T1 //true
new T2(t => t).then(v => v) instanceof T2 //false

/**
 * Symbol.match
 * 对象的Symbol.match属性，指向一个函数，当执行str.match(myObject)时，
 * 如果该属性存在，返回该方法的返回值
 */
String.prototype.match(regexp);
//等同于：
regexp[Symbol.match](this)

class MyMatcher {
    [Symbol.match](string) {
        return 'hello world'.indexOf(string);
    }
}
'e'.match(new MyMatcher()); //1
/**
 * Symbol.replace
 * 对象的Symbol.replace属性，指向一个方法，当对象被
 * String.prototype.replace方法调用时，会返回该方法的返回值
 */
//下面这个例子，在调用时会触发Symbol.replace
const x = {};
s[Symbol.replace] = (...args) => console.log(args);
'hello'.replace(x, 'world'); //['hello','world']
//Symbol.replace方法接收两个参数，第一个参数是replace方法正在作用的对象，
//第二个参数就是替换后的值

/**
 * Symbol.search
 * 该属性指向一个方法，当对象被String.prototype.search放到调用时
 * 会返回该方法的返回值
 */
class Myclass {
    constructor(value) {
        this.value = value;
    }
    [Symbol.search](string) {
        return string, indexOf(this.value)
    }
}
'foobar'.search(new Myclass('foo')); //0

/**
 * Symbol.split 
 * 该属性指向一个方法，当String.prototype.split被调用
 * 会返回该方法的返回值
 */
class MySplitter {
    constructor(value) {
        this.value = value;
    }
    [Symbol.split](string) {
        let index = string.indexOf(this.value);
        if (index === -1) {
            return string;
        }
        return [
            string.substr(0, index),
            string.substr(index + this.value.length)
        ];
    }
}
'foobar'.split(new MySplitter('foo'))
// ['', 'bar']
'foobar'.split(new MySplitter('bar'))
// ['foo', '']
'foobar'.split(new MySplitter('baz'))
// 'foobar'

/**
 * Symbol.iterator
 * 指向该对象的默认遍历器方法
 */
//对象进行for...of循环时，会调用Symbol.iterator方法，返回该对象的默认遍历器
class Collection {
    *[Symbol.iterator]() {
        let i = 0;
        while (this[i] !== undefined) {
            yield this[i] + 1
            ++i;
        }
    }
}
let mycollection = new mycollection();
mycollection[0] = 2;
mycollection[1] = 3;
for (let value of mycollection) {
    console.log(value); //3   4
}

/**
 * Symbol.toPrimitive
 * 指向一个方法，当对象被转为原始类型的值时，会调用该方法，返回该对象的
 * 原始类型值
 */
//一共有三种模式：
//Number
//String
//default
let obj = {
    [Symbol.toPrimitive](hint) {
        switch (hint) {
            case 'number': return 123;
            case 'string': return 'str';
            case 'default': return 'default';
            default: throw new Error()
        }
    }
}
2 * obj;//246
3 + obj; //’3default‘
obj === 'default';//true
String(obj); //’str‘

/**
 * Symbol.toStringTag
 * 该属性指向一个方法，在该对象上调用String.prototype.toString()方法时
 * 如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。
 * 也就是说，这个属性可以用来定制[object Object]或
 * [object Array]中object后面的那个字符串
 */
//example1:
({ [Symbol.toStringTag]: 'Foo' }.toString());
//"[object Foo]"
//example2:
class Collection {
    get [Symbol.toStringTag]() {
        return 'xxx';
    }
}
let x = new Collection();
Object.prototype.toString.call(x); //"[object xxx]"

/**
 * Symbol.unscopables
 * 该属性指向一个对象，该属性指定调用了with关键字时，
 * 哪些属性会被with环境排除
 */
Array.prototype[Symbol.unscopables]
// {
//   copyWithin: true,
//   entries: true,
//   fill: true,
//   find: true,
//   findIndex: true,
//   includes: true,
//   keys: true
// }
Object.keys(Array.prototype[Symbol.unscopables])
// ['copyWithin', 'entries', 'fill', 'find', 'findIndex', 'includes', 'keys']
//上面代码会打印出这些属性不会被with命令排除
//没有unscopables时
class Myclass {
    foo() {
        return 1;
    }
}
var foo = function () { return 2; }
with (Myclass.prototype) {
    foo(); //1
}
//当有unscopables时：
class Myclass {
    foo() {
        return 1;
    }
    get [Symbol.unscopables]() {
        return { foo: true };
    }
}
var foo = function () { return 2; };
with (Myclass.prototype) {
    foo();//2
}
