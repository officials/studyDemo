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
 * Proxy的实例方法
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

/**
 * 利用Proxy,可以实现读取属性的操作，转变为执行某个函数，从而实现属性的链式操作
 */
var pipe = (function () {
    return function (value) {
        var funcStack = [];
        var proxy = new Proxy({}, {
            get: function (target, fnName) {
                if (fnName === 'get') {
                    return funcStack.reduce(function (val, fn) {
                        return fn(val);
                    }, value)
                }
                funcStack.push(window[fnName]);
                return proxy;
            }
        })
    }
}());
var double = n => n * 2;
var pow = n => n ** 2;
var receiverInt = n => n.toString().split("").reverse().join("") | 0;
pipe(3).double.pow.receiverInt.get; //62

/**
 * 下面例子是用get拦截，实现一个生成各种DOM节点的通用函数
 */
const dom = new Proxy({}, {
    get(target, property) {
        return function (attrs = {}, ...children) {
            const el = document.createElement(property);
            for (let prop of Object.keys(attrs)) {
                el.setAttribute(prop, attrs[prop]);
            }
            for (let child of children) {
                if (typeof child === 'string') {
                    child = document.createTextNode(child);
                }
                el.appendChild(child);
            }
            return el;
        }
    }
});
const el = dom.div({},
    'Hello, my name is ',
    dom.a({ href: '//example.com' }, 'Mark'),
    '. I like:',
    dom.ul({},
        dom.li({}, 'The web'),
        dom.li({}, 'Food'),
        dom.li({}, '…actually that\'s it')
    )
);
document.body.appendChild(el);

/**
 * 下面这个例子是通获取get第三个参数的例子，它总是指向原始的读操作所在的对象
 * 一般情况下就是Proxy实例
 */
const proxy = new Proxy({}, {
    gte: function (target, property, receicer) {
        return receicer
    }
});
proxy.getReceiver === proxy;

/**
 * 再看一个简单的例子
 */
const proxy = new Proxy({}, {
    get: function (target, property, receiver) {
        return receiver;
    }
});
const d = Object.create(proxy);
d.a === d // true

/**
 * 如果一个属性不可配置（configurable）且不可写（writable）,
 * 则Proxy不能修改该属性，通过Proxy
 */
const target = Object.defineProperties({}, {
    foo: {
        value: 123,
        writable: false,
        configurable: false
    }
});
const handler = {
    get: function (target, property) {
        return 'abc';
    }
}
const proxy = new Proxy(target, handler);
proxy.foo;
// 'get' on proxy: property 'foo' is a read-only and 
//non-configurable data property on the proxy target 
//but the proxy did not return its actual value 
proxy.doo;// ’abc‘

/**
 * set方法用来拦截某个属性的赋值操作，可以接受4个参数，依次为
 * 目标对象，属性名，属性值，proxy实例本身
 */
//首先来说一下js常见的几种构造函数（Error）
throw new SyntaxError(); //解析代码时发生的语法错误
throw new ReferenceError(); //引用一个不存在的变量时引发的错误
throw new RangeError();//当一个值超出有效范围发生的错误
throw new TypeError() //变量或者参数不是预期类型时发生的错误
//接下来我们看一个person.age超过200的set拦截器
var vaildator = {
    set: function (target, property, value, receiver) {
        if (property === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('value is not a number');
            }
            if (value > 200) {
                throw new RangeError('age can not more exceed 200');
            }
        }
        return Reflect.set(target, property, value, receiver);
    }

}
let person = new Proxy({}, vaildator);
person.age = '123'; // value is not a number
person.age = 100; //100
person.age = 250;//age can not more exceed 200

/**
 * 在很多时候，我们会在对象上写内部属性，以下划线开头，表示这些属性不可以被外部使用
 * 这个时候，我们可以使用拦截器，防止私有属性被读取和改变
 */
var handler = {
    get: function (target, property) {
        invariant(property);
    },
    set: function (target, property, value) {
        invariant(property);
    }
}
function invariant(prop) {
    if (prop.startsWith('_')) {
        throw new Error('you can not use this private prop');
    }
}
const target = {};
const proxy = new Proxy(target, handler);

/**
 * 当然，set也可以像get那样，将proxy挂在到目标对象的原型上
 * Object.create()
 */

/**
 * set方法也同get 方法一样，如果目标对象属性不可写切不可读，set方法将不起作用
 */

/**
 * 注意，在严格模式下，set代理没有返回true就会报错
 */
"use strict"
const hanlder = {
    set: function (obj, prop, value, receiver) {
        obj[prop] = receiver;
        // 无论有没有下面这一行，都会报错
        return false;
    }
};

const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
// TypeError: 'set' on proxy: trap returned falsish for property 'foo'

/**
 * apply() 拦截函数的调用，call、apply操作
 * 接收三个参数，依次是：目标对象，目标对象上下文（this),目标对象的参数数组
 */
var target = () => console.log('i am the target');
var handler = {
    apply: () => {
        return 'i am the proxy';
    }
}
var p = new Proxy(target, handler);
p(); //'i am the proxy'
//上面的代码，变量p是Proxy的实例，当他作为函数调用时p(),就会被apply拦截

/**
 * 再看一个例子
 */
var twice = {
    apply: (target, ctx, args) => {
        return Reflect.apply(...arguments) * 2;
    }
}
function sum(left, right) {
    return left + right;
}
var proxy = new Proxy(sum, twice);
proto(1, 2); //6
proxy.call(null, 1, 2);//6
proxy.apply(null, [1, 2]); //6
Reflect.apply(proxy, null, [2, 3]); //10

/**
 * 实例：Web 服务的客户端
 */
// Proxy 对象可以拦截目标对象的任意属性，这使得它很合适用来写 Web 服务的客户端。
const service = createWebService('http://example.com/data');
service.employees().then(json => {
    const employees = JSON.parse(json);
    // ···
});
// 上面代码新建了一个 Web 服务的接口，这个接口返回各种数据。Proxy 可以拦截这个对象的任意属性，所以不用为每一种数据写一个适配方法，只要写一个 Proxy 拦截就可以了。
function createWebService(baseUrl) {
    return new Proxy({}, {
        get(target, propKey, receiver) {
            return () => httpGet(baseUrl + '/' + propKey);
        }
    });
}
// 同理，Proxy 也可以用来实现数据库的 ORM 层。