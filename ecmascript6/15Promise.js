/**
 * Promise是异步编程的一种解决方案，简单来说就是一个容器，
 * 里面保存着某个未来才会结束的事件的结果
 * Promise有以下两个特点：
 * 1.对象的状态不受外界的影响，共有三种状态：pending(进行中)、fulfilled(已成功)、rejected（已失败）
 * 2.一旦状态改变，就不会再变，两种可能：pending->fulfilled  pending->rejected
 * 这也就是Promise这个名字的由来，译为承诺，表示其他手段无法改变
 * Promise也有一些缺点：首先，无法取消Promise，一旦创建就会立即执行，其次，如果不设置
 * 回调函数，Promise内部抛出错误无法反映到外部，当处于pending状态时，
 * 无法得知进展到哪一个阶段
 */
const promise = new Promise(function (resolve, rejected) {
    //...
    if (/* 异步操作成功*/) {
        resolve(value);
    } else {
        rejected(value);
    }
});

/**
 * promise实例生成后，可以用then方法分别指定resolved状态和rejected状态返回的回调函数
 */
function timeout(ms) {
    return new Promise((reslove, rejected) => {
        setTimeout(reslove, ms, 'done');
    });
}
timeout(100).then((value) => {
    console.log(value);
});//'done'

/**
 * Promise创建后就会立即执行
 */
let promise = new Promise(function (resolve, rejected) {
    console.log('promise');
    resolve();
});
promise.then(() => {
    console.log('resolved');
})
console.log('Hi');
//promise
//Hi
//resloved

/**
 * 下面是一个Promise实现ajax的例子
 */
const getJson = function (url) {
    return new Promise((resolve, rejected) => {
        const handler = function () {
            if (this.status === 200 && this.readyState === 4) {
                resolve(this.response);
            } else {
                rejected(new Error('there has err'));
            }
        }
        const xml = new XMLHttpRequest();
        xml.open('GET', url);
        xml.send();
        xml.onreadystatechange = handler;
    })
}
getJson('./config.json').then((response) => {
    console.log(response);
}).function((err) => {
    console.log(err);
})

/**
 * 再看一个简单例子
 */
new Promise((resolve, rejected) => {
    resolve(1);
    console.log(2);
}).then((r) => { console.log(r) });
// 2  1
//上面的代码中，resolve以后还是会执行后面的代码，打印出 2   1
//因为立即执行resolve的Promise是在本轮事件循环的末尾执行，
//总是晚于本轮循环的同步任务

/**
 * 如果需要resolve或者reject之后的代码不再执行，那么需要加上return语句，这样就不会有意外
 */
new Promise((resolve, reject) => {
    return resolve(1);
    // 后面的语句不会执行
    console.log(2);
})

/**
 * 采用链式.then，可以指定一组按照顺序执行的回调函数
 */
getJSON("/post/1.json").then(function (post) {
    return getJSON(post.commentURL);
}).then(function funcA(comments) {
    console.log("resolved: ", comments);
}, function funcB(err) {
    console.log("rejected: ", err);
});
//当然，如果只有一次resolve，有多个then方法，也会继续执行链式then的回调函数
//保证了回到函数顺序执行

/**
 * Promise.prototype.catch()
 */
getJSON('/posts.json').then(function (posts) {
    // ...
}).catch(function (error) {
    // 处理 getJSON 和 前一个回调函数运行时发生的错误
    console.log('发生错误！', error);
});

/**
 * .then方法后的回调函数，也可以捕获运行中的抛出错误，也会被catch捕获
 */
p.then((val) => console.log('fulfilled:', val))
    .catch((err) => console.log('rejected', err));
// 等同于
p.then((val) => console.log('fulfilled:', val))
    .then(null, (err) => console.log("rejected:", err));

/**
 * 如果Promise状态已经变成resolved，那么再抛出错误也是无效的
 */

/**
 * 一般来说，不要在then方法里定义rejected状态的回调函数
 * 总是使用catch方法会比较好
 */// bad
promise
    .then(function (data) {
        // success
    }, function (err) {
        // error
    });
// good
promise
    .then(function (data) { //cb
        // success
    })
    .catch(function (err) {
        // error
    });

/**
 * 在catch方法中，我们还可以继续抛出错误
 */
const dosomething = () => {
    return new Promise((resolve, reject) => {
        //下面这行会报错，因为x没有声明
        resolve(x + 2);
    })
}
dosomething().then(() => {
    return dosomething();
}).catch((err) => {
    console.log('err has happened');
    y + 2;//抛出错误，因为y未声明
}).then(() => { console.log('carry on') })
//err has happened
//上面代码中，catch方法抛出错误，因为后面没有别的catch方法，导致后面的错误没有被捕获

/**
 * 如果将上面代码改写，结果就不一样了
 */
someAsyncThing().then(function () {
    return someOtherAsyncThing();
}).catch(function (error) {
    console.log('oh no', error);
    // 下面一行会报错，因为y没有声明
    y + 2;
}).catch(function (error) {
    console.log('carry on', error);
});
// oh no [ReferenceError: x is not defined]
// carry on [ReferenceError: y is not defined]

/**
 * Promise.prototype.finally()
 * finally方法用于指定不管Promise状态如何，都会执行的操作
 */
promise
    .then(result => {/*... */ })
    .catch(err => {/*... */ })
    .finally(() => {/*... */ })

/**
 * finally实质上是then方法的特例
 */
promise
    .finally(() => {

    })
//等同于：
promise
    .then((result) => {

    }, (err) => {

    })

/**
 * Promise.all()
 * 用于多个Promise实例，包装成一个新的Promise实例
 */
const p = Promise.all([p1, p2, p3]);
/**
 * 上面代码中，Promise.all方法接收一个数组作为参数
 * p的状态由p1,p2,p3决定，分为两种情况：
 * 1.当p1,p2,p3状态都变成fulfilled，p的状态才会变成fulfilled
 * 2.只要p1,p2,p3之中有一个被reject，p的状态就会变成rejected
 */

/**
 * 注意：如果Promise.all队列中有promise自己定义的catch方法，那么一旦它被rejected
 * 就不会触发Promise.all的catch方法
 */
const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
    .then(result => result)
    .catch(e => e);
const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
    .then(result => result)
    .catch(e => e);
Promise.all([p1, p2])
    .then(result => console.log(result))
    .catch(e => console.log(e));
// ["hello", Error: 报错了]

/**
 * Promise.race()
 * 同样是将多个Promise实例包装成一个Promise实例
 * 下面实现一个如果在5s内没有获得结果，那么久reject的例子
 */
const p = Promise.race([
    fetch('/xxxxxxxx'),
    new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error()), 5000);
    })
])
p
    .then(console.log)
    .catch(console.error)

/**
 * Promise.resolve()
 * 将现有的对象转换为Promise对象
 */


/**
 * Promise,resolve方法的参数分为4种情况：
 * 1.如果参数是Promise实例，那么Promise.resolve不做任何修改，原封不动的返回这个实例
 * 2.thenable对象指的是具有then方法的对象
 * 3.如果参数是一个原始值，或者不具有then方法的对象，则Promise.resolve方法返回一个新的Promise对象，状态为resolved
 * 4.Promise.resolve方法允许调用不带参数，直接返回一个resolved状态的Promise对象
 */
//------------------------1:
Promise.resolve('foo');
//等同于：
new Promise((resolve) => resolve('foo'));

//------------------------2:
let thenable = {
    then: function (resolve, reject) {
        resolve(42);
    }
}
let p1 = Promise.reslove(thenable);
p1
    .then(function (value) {
        console.log(value); //42
    });

//------------------------3:
const p = Promise.resolve('Hello');
p.then(result => { console.log(result) }); //'Hello'

//------------------------4:
const p = Promise.resolve();
p.then(function () {
    // ...
});

/**
 * 需要注意的是，立即resolve的Promise对象，实在本轮事件循环结束时才执行，而不是在下一轮事件循环的开始时
 */
setTimeout(function () {
    console.log('three');
});
Promise.resolve().then(() => { console.log('two') });
console.log('one');
// one   two    three

/**
 * Promise.reject()
 * 返回一个新的Promise实例，该实例状态为rejected
 * 注意，Promise.reject()方法的参数，会原封不动地作为reject的理由，
 * 变成后续方法的参数。这一点与Promise.resolve方法不一致。
 */
const thenable = {
    then: function (resolve, reject) {
        reject('出错了');
    }
};
Promise.reject(thenable).catch(e => {
    console.log(e === thenable);
})//true

/**
 * 接下来我们练习一下Promise的应用
 */
//我们可以将图片的加载写成一个Promise，一旦加载完成，Promise的状态就会发生变化
const preload = function (path) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = paht;
    });
};

/**
 * generator函数与Promise的结合
 */
function getFoo() {
    return new Promise((resolve, reject) => {
        resolve('foo');
    })
}
const g = function* () {
    try {
        const foo = yield getFoo();
        console.log(foo);
    } catch (e) {
        console.log(e);
    }
}
function run(generator) {
    const it = generator();
    function go(result) {
        if (result.done) return result.value;
        return result.value.then(function (value) {
            return go(it.next(value));
        }, function (err) {
            return go(it.throw(err));
        })
    }
    go(it.next());
}
run(g);

/**
 * Promise.try()
 * 在开发中，我们有时候不知道函数f是同步还是异步，但是想用Promise来处理它
 * 因为这样不管f是否包含异步操作，都用then方法指定下一步流程，一般会采用下面的写法
 */
const f = () => { console.log('now'); }
Promise.resolve().then(f);
console.log('next');
//next
//now
//这个写法有一个缺点，如果函数f是同步函数，那么将在本轮事件末尾执行

/**
 * 下面这个方法，让同步函数同步执行，异步函数异步执行
 * 第一种写法就是用async函数来写
 */
const f = () => console.log('now');
(async () => f())();
console.log('next');
// now 
// next

/**
 * 需要注意的是，async函数会吃掉f()抛出的错误，所以，想要捕获错误，就要使用Promise.catch方法
 */
(async () => f())()
    .then(/**... */)
    .catch(/**... */);
//第二种方法就是使用new Promise()
const f = () => console.log('now');
(
    () => new Promise(
        resolve => resolve(f())
    )
)();
console.log('next');
// now
// nex

/**
 * 基于上面的需求，同步函数同步执行，异步函数异步执行，提供Promise.try()
 */
const f = () => console.log('now');
Promise.prototype(f());
console.log('next');
// now 
// next

/**
 * demo
 */
Promise.try(() => database.users.get({ id: userId }))
    .then(...)
    .catch(...)