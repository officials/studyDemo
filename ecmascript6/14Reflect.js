/**
 * Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API。
 * Reflect对象的设计目的有这样几个。
 * (1） 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），
 * 放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，
 * 未来的新方法将只部署在Reflect对象上。也就是说，
 * 从Reflect对象上可以拿到语言内部的方法。
 * 2） 修改某些Object方法的返回结果，让其变得更合理。比如，
 * Object.defineProperty(obj, name, desc)在无法定义属性时，
 * 会抛出一个错误，而Reflect.defineProperty(obj, name, desc)
 * 则会返回false。
 */
// 老写法
try {
    Object.defineProperty(target, property, attributes);
    // success
} catch (e) {
    // failure
}
// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
    // success
} else {
    // failure
}
/**
 * （3） 让Object操作都变成函数行为。某些Object操作是命令式，
 * 比如name in obj和delete obj[name]，
 * 而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)
 * 让它们变成了函数行为。
 */
// 老写法
'assign' in Object // true
// 新写法
Reflect.has(Object, 'assign') // true

/**
 * （4）Reflect对象的方法与Proxy对象的方法一一对应，
 * 只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
 * 这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，
 * 作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，
 * 你总可以在Reflect上获取默认行为。
 */
Proxy(target, {
    set: function (target, name, value, receiver) {
        var success = Reflect.set(target, name, value, receiver);
        if (success) {
            console.log('property ' + name + ' on ' + target + ' set to ' + value);
        }
        return success;
    }
})

/**
 * 下面代码中，每一个Proxy对象的拦截操作（get、delete、has），
 * 内部都调用对应的Reflect方法，保证原生行为能够正常执行。
 * 添加的工作，就是将每一个操作输出一行日志。
 */
var loggedObj = new Proxy(obj, {
    get(target, name) {
        console.log('get', target, name);
        return Reflect.get(target, name);
    },
    deleteProperty(target, name) {
        console.log('delete' + name);
        return Reflect.deleteProperty(target, name);
    },
    has(target, name) {
        console.log('has' + name);
        return Reflect.has(target, name);
    }
});

/**
 * 有了Reflect以后，很多操作会更加易读
 */
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1
// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1

/**
 * Reflect静态方法
 * 和Proxy一样，都是13中，并且与Proxy对象的方法都是一一对应的
 */

/**
 * Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined
 */
var myobj = {
    foo: 1,
    bar: 2,
    get baz() {
        return this.foo + this.bar
    }
}
Reflect.get(myobj, foo); //1
Reflect.get(myobj, bar); //2
Reflect.get(myobj, baz); //3

/**
 * 如果name属性设置了赋值函数。则赋值函数的this绑定receiver
 */
var myobj = {
    foo: 40,
    bar: 2,
    get baz(value) {
        return this.foo = value
    }
}
var myReceiver = {
    foo: 0
}
Reflect.set(myobj, 'baz', 1, myReceiver);
myobj.foo; //40
myReceiver.foo;//1
//此时赋值函数是myReceiver，并且this指向当前myReceiver对象

/**
 * 注意，如果 Proxy对象和 Reflect对象联合使用，前者拦截赋值操作，
 * 后者完成赋值的默认行为，而且传入了receiver，
 * 那么Reflect.set会触发Proxy.defineProperty拦截。
 */
let p = {
    a: 'a'
};
let handler = {
    set(target, key, value, receiver) {
        console.log('set');
        Reflect.set(target, key, value, receiver)
    },
    defineProperty(target, key, attribute) {
        console.log('defineProperty');
        Reflect.defineProperty(target, key, attribute);
    }
};
let obj = new Proxy(p, handler);
obj.a = 'A';
// set
// defineProperty

/**
 * 上述的剩余静态方法将不会在练习，官方文档看一眼就行，最后，我们利用Proxy
 * 实现观察者模式
 */

let queues = new Set();
const observe = fn => queues.add(fn);
let handler = {
    set: (target, property, value, receiver) => {
        queues.forEach(fn => fn());
        return Reflect.set(target, property, value, receiver);
    }
}
const observable = obj => new Proxy(obj, handler);
var person = observable({
    name: 'duan',
    age: 24
});
observe(() => { alert('changed') });
person.name='张三'; //将alert changed
/**
 * 以上代码就是将目标对象创建以构造函数Proxy的实例，
 * 通过Proxy的set拦截器，触发function
 */