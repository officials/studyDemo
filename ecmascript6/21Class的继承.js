/**
 * class可以通过extends关键字实现继承
 */
class Point { }
class ColorPoint extends Point { }

/**
 * 子类调用父类的方法，需要super关键字调用
 */
class ColorPoint extends Point {
    constructor(color) {
        super(x, y);
        this.color = color;
    }
    toString() {
        return this.color + ' ' + super.toString();
    }
}

/**
 * 任何Class都有constructor方法，不管有没有显式定义，都会默认添加
 */
class ColorPoint extends Point {
}
// 等同于
class ColorPoint extends Point {
    constructor(...args) {
        super(...args);
    }
}

/**
 * 需要注意的是，子类的构造函数中，只有调用super关键字以后，才能使用this
 * 否则或报错
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class ColorPoint extends Point {
    constructor(x, y, color) {
        this.color = color; //RefreenceError
        super(x, y);
        this.color = color; // right
    }
}
let cp = new ColorPoint(25, 8, 'green');
cp instanceof ColorPoint; //true
cp instanceof Point; //true

/**
 * Object.getPrototypeOf()
 * 可以从子类上获取父类
 */
Object.getPrototypeOf(ColorPoint) === Point;  //true

/**
 * super关键字的含义
 */
class A { }
class B extends A {
    constructor() {
        super();
    }
}
//上面代码中，super虽然代表了构造函数A，但是返回的是子类B的实例，即
//super内部this指的是B的实例，因此super在这里相当于：
A.prototype.constructor.call(this);

/**
 * 再看一个例子，便于理解上面的super
 */
class A {
    constructor() {
        console.log(new.target.name);
    }
}
class B extends A {
    constructor() {
        super();
    }
}
new A(); //'A'
new B(); //'B'
//上面的代码说明了，super的this就是子类的this

/**
 * 第二种情况，super关键字作为普通方法调用时，指向父类的原型对象
 */
class A {
    p() {
        return 2;
    }
}
class B extends A {
    constructor() {
        super();
        console.log(super.p()); //2
    }
}
let b = new B();

/**
 * 需要注意的是，super关键字被用作普通函数执行时，指向的是父类的构造函数，而不是
 * 父类的实例，所以无法通过super调用父类的属性
 */
class A {
    constructor() {
        this.p = 2;
    }
}
class B extends A {
    constructor() {
        super();
    }
    get m() {
        return super.p;
    }
}
let b = new B();
b.m;  //undefined

/**
 * 如果属性定义在父类的原型上，super关键字就可以取到
 */
class A { }
A.prototype.x = 2;
class B extends A {
    constructor() {
        super();
        console.log(super.x); //2
    }
}
let b = new B();

/**
 * super用作普通函数调用时，上面也说了，super指的就是父类的原型对象
 * 在调用父类的方法时，方法内部的this指向当前的子类实例，如下
 */
class A {
    constructor() {
        this.x = 1;
    }
    print() {
        console.log(this.x);
    }
}
class B extends A {
    constructor() {
        super();
        this.x = 2;
    }
    m() {
        super.print();
    }
}
let b = new B();
b.m(); //2
//虽然通过super使用了父类的方法，但是方法内部的this指向了子类的实例

/**
 * 再看一个和上面一样的例子
 */
class A {
    constructor() {
        this.x = 1;
    }
}
class B extends A {
    constructor() {
        super();
        this.x = 2;
        super.x = 3;
        console.log(super.x); //undefined
        console.log(this.x); //3
    }
}
let b = new B();
//这段代码中，上面我们说了，super当做普通函数调用时，super指的是父类的原型，
//并不是父类的实例，所以得不到父类的x，而在调用super。.x=3是，this指向子类的实例
//所以this.x会变成3，调用super.x，其实就是相当于调用了A.prototype.x，返回undefined

/**
 * super作为对象，在静态方法中，super指向父类
 */
class Parent {
    static myMethod(msg) {
        console.log('static ' + msg);
    }
    myMethod(msg) {
        console.log('instance ' + msg);
    }
}
class Child extends Parent {
    constructor() {
        super();
    }
    static myMethod(msg) {
        super.myMethod(msg);
    }
    myMethod(msg) {
        super.myMethod();
    }
}
Child.myMethod(1); // static 1
let child = new Child();
child.myMethod(2);
//instance 2

/**
 * 另外，在子类的静态方法中通过super调用父类的方法，方法内部的this指向
 * 当前子类，而不是子类的实例对象
 */
class A {
    constructor() {
        this.x = 1;
    }
    static print() {
        console.log(this.x);
    }
}
class B extends A {
    constructor() {
        super();
        this.x = 2;
    }
    static m() {
        super.print();
    }
}
B.x = 3;
B.m(); //3

/**
 * 类的prototype属性和__proto__属性
 *  每一个对象都有__proto__属性，但是在类里，Class作为构造函数的语法糖，
 * 同时拥有prototype和__proto__属性，因此也同时存在两条继承连
 * 1.子类的__proto__属性，表示构造函数的继承，总是指向父类
 * 2.子类的prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性
 */
class A { }
class B extends A { }
B.__proto__ === A;  //true
B.prototype.__proto__ === A.prototype;

/**
 * 
 * 上面那样做的结果是因为下面的模式实现
 */
class A { }
class B { }
//B实例继承A的实例
Object.setPrototypeOf(B.prototype, A.prototype);
//B继承A的静态属性
Object.setPrototypeOf(B, A);

/**
 * 下面，讨论两种情况
 * 第一种，子类继承Object类
 */
class A extends Object { }
A.__proto__ === Object; //true
A.prototype.__proto__ === Object.prototype;  //true

/**
 * 第二种情况，不存在任何继承
 */
class A { }
A.__proto__ === Function.prototype;  //true
A.prototype.__proto__ === Object.prototype;

/**
 * 实例的__proto__属性
 * 子类实例的__proto__属性的__proto__属性，指向父类的__proto__属性
 * 也就是说，子类的原型的原型，就是父类的原型
 */
var p1=new Point(2,3);
var p2=new ColorPoint(2,3,'green');
p2.__proto__===p1.__proto__; //false
p2.__proto__.__proto__===p1.__proto__;  //true

/**
 * es6允许继承原生构造函数，因为es6是先创建父类的实例对象this，然后再用子类的
 * 构造函数修饰this
 */
class MyArray extends Array{
    constructor(...args){
        super(...args);
    }
}
var arr=new MyArray();
arr[0]=12;
arr.length; //1
arr.length=0;
arr[0] //undefined

/**
 * Mixin模式的实现
 * Mixin指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口
 */
const a={a:'a'};
const b={b:'b'};
const c={...a,...b}; //{a: 'a', b: 'b'}
