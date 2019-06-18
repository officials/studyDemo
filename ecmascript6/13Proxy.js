/**
 * Proxy用于修改某些操作的默认行为
 * 可以理解成，在目标对象之前设置一层’拦截‘，外界对该对象的访问，
 * 都必须通过这层拦截，可以对外界的访问进行过滤和改写，可以译为’代理器‘
 */
//下面看一个简单的实例
var obj = new Proxy({}, {
    get: function (target, key, receiver) {
        console.log(`getting ${key}`);
        return Reflect.get(target, key, receiver);
    },
    set: function (target, key, value, receiver) {
        console.log(`setting ${key} and value is ${value}`);
        return Reflect.set(target, key, value, receiver);
    }
});
obj.count; //getting count
obj.count = 1;//getting count  setting count and value is 1
//上面代码说明，Proxy重载了点运算符，即用自己的定义覆盖了语言的原始定义

/**
 * es6提供了Proxy构造函数，用来生成Proxy实例
 */
var pro = new Proxy(target, handler);

/**
 * 下面这个例子，因为handler是一个空对象，没有任何拦截效果
 * 所以访问proxy就等同于访问target
 */
var target = {};
var handler = {};
var proxy = new Proxy(target, handler);
proxy.a = 'b';
target.a;//'b'

/**
 * 需要知道的一个技巧，就是讲Proxy设置到object.proxy属性上，这样就可以在object对象上调用
 */
var object = { proxy: new Proxy(target, handler) };

/**
 * Proxy也可以作为其他对象的原型对象
 */
var proxy = new Proxy({}, {
    get: function (target, property) {
        return 35;
    }
});
var obj = Object.create(proxy);
obj.name; //35
//以上代码obj将proxy作为自己的原型，obj本身没有name属性，这个时候就会找到
//obj的原型proxy，proxy产生拦截效果

/**
 * 同一个拦截器函数，可以拦截多个操作
 */
var handler = {
    set: function (target, property) {
        if (property === 'prototype') {
            return Object.prototype;
        }
        return 'hello' + property;
    },
    apply: function (target, thisBuilding, args) {
        return args[0]
    },
    construct: function (target, args) {
        return { value: args[1] };
    }
}
var proxy = new Proxy(function (x, y) {
    return x + y
}, handler);
proxy(1, 2);//1
new proxy(1, 2);//2
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true
//这个例子了解需要本章后面的知识

/**
 * 下面是Proxy支持拦截的属性，一共13种
 * 1.get(target,property,reciver):拦截对象的读取
 * 2.set(target,property,value,reciver):拦截对象属性的设置
 * 3.has(target,property):拦截propertyKey in proxy的操作
 * 4.deleteProxy(target,propKey):拦截delete proxy[propKey]的操作
 * 5.ownKeys(target):拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环
 * 6.getOwnPropertyDescriptor(target,propKey):拦截Object.getOwnPropertyDescriptor(proxy,propKey)
 * 7.defineProperty(target,propKey,propDesc):拦截Object.defineProperty(proxy,propKey,propDesc)、Object.defineProperty(proxy,propDescs)
 * 8.preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
 * 9.getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
 * 10.isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值
 * 11.etPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
 * 12.apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
 * 13.construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
 */

/**
 * Proxy的手实例方法
 */

/**
 * get()
 * 用于拦截某个属性的读取操作，可以接受三个参数，target，property,reciver
 */
var person = {
    name: "张三"
};
var proxy = new Proxy(person, {
    get: function (target, property) {
        if (property in target) {
            return target[property];
        } else {
            throw new ReferenceError("Property \"" + property + "\" does not exist.");
        }
    }
});
proxy.name // "张三"
proxy.age // 抛出一个错误
//就如上面例子中，get方法可以实现继承，Object.create()
let proto = new Proxy({}, {
    get: function (target, property, receiver) {
        console.log('执行了');
        return target[property]
    }
});
let obj = Object.create(proto);
obj.foo // ’执行了‘

/**
 * 下面这个例子，实现了赎罪负数取值的索引
 * 到目前，还没有看Reflect，目前可以认为Reflect的方法和Proxy一一对应
 * 返回对象的默认行为
 */
function createArray(...arr) {
    let handler = {
        get: function (target, property, receiver) {
            let len = target.length;
            if (Number(property) < 0) {
                let index = Number(property) + len;
                property = index;
            }
            return Reflect.get(target, property, receiver);

        }
    };
    let target = [];
    target = [...arr];
    return new Proxy(target, handler)
}
let arr = createArray('a', 'b', 'c');
arr[-1] //'c'