/**
 * Object,is()
 * 比较两个值是否相等
 * 不同之处只有两个：一是+0不等于-0，二是NaN等于自身
 */
+0 === -0 //true
NaN === NaN // false
Object.is(+0, -0) // false
Object.is(NaN, NaN) // true

/**
 * Object.assign()
 * 该方法用于对象的合并，将源对象所有可枚举属性复制到目标对象
 */
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);
target // {a:1, b:2, c:3
//注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性

/**
 * Object.assign()是浅拷贝，拷贝得到对象的引用，拷贝的对象发生任何变化，都会映射到源对象上
 */
const obj1 = { a: { b: 1 } };
const obj2 = Object.assign({}, obj1);
obj1.a.b = 2;
obj2.a.b // 2

/**
 * 同名属性替换
 */
const target = { a: { b: 'c', d: 'e' } }
const source = { a: { b: 'hello' } }
Object.assign(target, source)
// { a: { b: 'hello' } }

/**
 * Object.assign只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制
 */
const source = {
    get foo() { return 1 }
};
const target = {};
Object.assign(target, source)
// { foo: 1 }

/**
 * Object.assign()的常见用途
 * 1.为对象添加属性
 * 2.为对象添加方法
 * 3.克隆对象
 * 4.合并多个对象
 * 5.为属性指定默认值
 */
//1:
class Point {
    constructor(x, y) {
        Object.assign(x, y);
    }
}
//2:
Object.assign(SomeClass.prototype, {
    someMethed(arg1, arg2) {
        //...
    }
})
//3:
function clone(origin) {
    return Object.assign({}, origin);
}
//上面的方法拷贝到了一个空对象上，只得到了对象原始的值，如果想要得到克隆对象继承的值，那么下面这样可以实现
function clone(origin) {
    return Object.assign(Object.create(origin.prototype), origin);
}
//4:
const merge = (target, ...sources) => {
    return Object.assign(target, ...source);
}
//如果希望合并后返回一个新对象，可以改写上面的函数
const merge = (...source) => Object.assign({}, ...source);
//5:
const defaults = {
    name: "name",
    age: 1
}
function processContent(options) {
    options = Object.assign({}, defaults, options);
}

/**
 * Object.getOwnPropertyDescriptors()
 * es5的Object.getOwnPropertyDescriptor()返回对象属性的描述对象
 * 而es6中Object.getOwnPropertyDescriptors()返回指定对象的所有自身属性（非继承属性）的描述对象
 */
const obj = {
    foo: 123,
    get bar() { return 'abc' }
};
Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } 
//下面的代码会实现上面的代码
function getOwnPropertyDescriptors(obj) {
    const result = {};
    for (let key of Reflect.ownKeys(obj)) {
        result[key] = Object.getOwnPropertyDescriptor(obj, key);
    }
}

/**
 * Object.getOwnPeoperDescriptors()也可以实现Object.assign()实现不了的拷贝
 * Object.assign()不能拷贝源对象的get set方法，但是利用Object.getOwnpropertyDescriptors()和object.defineProperties()方法就可以实现正确的拷贝
 */
const source = {
    set foo(value) {
        console.log(value);
    }
};
const target = {};
Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));

/**
 * Object.getOwnPropertyDescriptors()方法的另一个用处，
 * 是配合Object.create()方法，将对象属性克隆到一个新对象
 */
const clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
//或者
const shallowClone = (obj) => Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
)

/**
 * __proto__属性，Object.setPrototypeOf()
 * Object.setPrototypeOf()
 */
//__proto__属性用来读取设置当前对象的prototype对象
//实际上，__proto__调用的是Object.prototype.__proto__，实现如下：
Object.defineProperty(Object.prototype, '__proto__', {
    get() {
        let _thisObj = Object(this);
        return Object.getPrototypeOf(_thisObj);
    },
    set(proto) {
        if (this === undefined || this === null) {
            throw new TypeError();
        }
        if (!isObject(this)) {
            return undefined
        }
        if (!isObject(proto)) {
            return undefined
        }
        let status = Reflect.setPrototypeOf(this, proto);
        if (!status) {
            throw new TypeError();
        }
    }
})
function isObject(value) {
    return Object(value) === value;
}

/**
 * Object.setPrototypeOf() 用来设置一个对象的prototype对象，返回参数对象本身
 */
//格式：
Object.setPrototypeOf(obj, prototype);
//用法：
const o = Object.setPrototypeOf({}, null);
//等同于：
function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
    return obj;
}

/**
 * 下面这个例子，将proto对象设置为obj对象的原型，所以obj可以读取proto对象的属性
 */
let proto = {};
let obj = { x: 10 };
Object.setPrototypeOf(obj, proto);
proto.x = 20;
proto.y = 30;
obj.x //10
obj.y //30

/**
 * Object.getPrototypeOf()
 * 获取一个对象的原型对象
 */
function Rectangle() {
    //...
}
const rec = new Rectangle();
Object.getPrototypeOf(rec) === Rectangle.prototype//true

/**
 * Object.keys() 返回一个数组，成员是参数对象自身的（不含继承）所有可遍历属性的键名
 * Object.values() 返回一个数组，成员是参数对象自身的（不含继承）所有可遍历属性的值
 * Object.entries() 返回一个数组，成员是参数对象自身的（不含继承）所有可遍历属性的键值对
 */
var obj = { foo: "bar", baz: 40 };
Object.keys(obj); //['foo','baz']
//当然，也可以使用解构
let { keys, values, entries } = Object;
let obj = { a: 1, b: 2, c: 3 };
for (let key of keys(obj)) {
    console.log(key); //'a','b','c'
}
for (let value of values(obj)) {
    console.log(value); // 1, 2, 3
}
for (let [key, value] of entries(obj)) {
    console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
}

/**
 * 下面代码中，Object.create()方的第二个参数添加的对象属性，如果不显式声明，默认是不可遍历的
 */
const obj = Object.create({}, { p: { value: 42 } });
Object.values(obj); //[]
//下面的代码会解决上面的问题
const obj = Object.create({}, {
    p: {
        value: 42,
        enumerable: true
    }
});
Object.values(obj); //[42]

/**
 * Object.entries()
 */
const obj = { foo: 'bar', baz: 42 };
Object.entries(obj)
// [ ["foo", "bar"], ["baz", 42] ]

/**
 * 基本用法
 */
let obj = { one: 1, two: 2 };
for (let [k, v] of Object.entries(obj)) {
    console.log(k); //one two
}

/**
 * Object.fromEntries()
 * 是Object.entries()的逆操作，将键值对数组转为对象
 */
Object.fromEntries([
    ['foo', 'bar'],
    [11, 22]
]);
// {11: 22, foo: "bar"}

/**
 * 该方法主要目的，是将键值对数据结构还原为对象，因此特别适合将Map结构转为对象
 */
//example1:
const entries = new Map([
    ['foo', 11], ['bar', 22]
]);
Object.fromEntries(entries);//{foo:11,bar:22}
//example2:
const map = new Map().set('foo', true).set('bar', false);
Object.fromEntries(map); //{foo: true, bar: false}