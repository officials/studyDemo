/**
 * 类的由来
 * 在JavaScript语言中，生成实例对象的传统方法是通过构造函数，下面是一个例子
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.toString = function () {
    return '(' + this.x + ', ' + this.y + ')';
}
var p = new Point(1, 2);

/**
 * es6的class可以看做是一个语法糖，它的绝大部分功能，es5都可以实现，新的
 * class写法只是让对象原型的写法更加清晰，更加面向对象编程的语法
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

/**
 * es6的类，完全可以看成构造函数的另一种写法
 */
class Point { }
typeof Point  //'function'
Point === Point.prototype.constructor //true

/**
 * 构造函数的prototype属性，在es6的“类”上继续存在着，实际上，
 * 类的所有方法都定义在类的prototype上
 */
class Point {
    constructor() {
        // ...
    }
    toString() {
        // ...
    }
    toValue() {
        // ...
    }
}
// 等同于
Point.prototype = {
    constructor() { },
    toString() { },
    toValue() { },
};

/**
 * 在类的实例上调用方法，其实就是调用原型上的方法
 */
class B { }
let b = new B();
b.constructor === B.prototype.constructor; //true

/**
 * 由于类的方法定义在prototype对象上，所以类的新方法可以添加在prototype上
 * 使用Object.assign()方法可以很方便的添加多个方法
 */
class Point {
    constructor() {

    }
}
Object.assign(Point.prototype, {
    toString() { },
    toValue() { }
})

/**
 * 类内部所有定义的方法，都是不可枚举的
 */
class Point {
    constructor(x, y) {
        // ...
    }
    toString() {
        // ...
    }
}
Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

/**
 * 上面的代码中，toString()方法是Point内部方法，不可枚举，这一点和es5不同
 */
var Point = function (x, y) {
    // ...
};
Point.prototype.toString = function () {
    // ...
};
Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

/**
 * constructor方法是类的默认方法，通过new关键字生成对象实例时，
 * 自动调用该方法
 */

/**
 * 下面看一个例子
 */
//定义类
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}
var point = new Point(2, 3);
point.toString() // (2, 3)
point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true

/**
 * getter和setter
 * 对某个属性设置存值和取值的函数，勘界该属性的存取行为
 */
class Myclass {
    constructor() {

    }
    get prop() {
        return 'getter';
    }
    set prop(value) {
        console.log('setter:' + value);
    }
}
let inst = new Myclass();
inst.prop; //'getter'
inst.prop = 123; // setter: 123

/**
 * 属性表达式
 * 类的属性名，可以采用表达式
 */
let methedname = 'getArea';
class Square {
    constructor() { }
    [methedname]() { }
}

/**
 * class表达式，和函数一样，类也可以使用表达式的形式
 */
const Myclass = class Me {
    getClassName() {
        return Me.name
    }
}
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
//需要注意的是，上面代码类名是Me,但是Me只在Class的内部可用，在Class外部
//这个类只能用MyClass引用

/**
 * 采用class表达式，可以写出立即执行的Class
 */
let person = class Person {
    constructor(name) {
        thius.name = name;
    }
    sayName() {
        console.log(this.name);
    }
}('张三');
person.sayName(); //’张三‘

/**
 * 类的方法内部如果含有this，它默认指向类的实例，一旦单独使用，很可能报错
 */
class Logger {
    prinitName(name = 'there') {
        this.print(`Hello ${name}`);
    }
    print(test) {
        console.log(text);
    }
}
const logger = new Logger();
const { prinitName } = logger;
prinitName(); //TypeError: Cannot read property 'print' of undefined
/**
 * 上面代码中，printName方法中的this，默认指向Logger类的实例，但是，如果将
 * 这个方法提取出来，this会指向该方法运行时所在的环境，从而导致找不到print方法
 */

/**
 * 对于上面的问题，this指向问题，下面提供几种解决方案
 */
//第一种解决方法就是在构造函数里绑定this
class Logger {
    constructor() {
        this.prinitName = this.prinitName.bind(this);
    }
}
//另一种解决办就是使用箭头函数
class Logger {
    constructor() {
        this.prinitName = () => this;
    }
}
const myObj = new Logger();
myObj.prinitName === myObj; //true
//上面的代码，因为箭头函数的this总是指向定义是所在的环境，箭头函数位于构造函数内部
//它的定义生效是在构造函数执行时，所以箭头函数的this指向实例对象

//还有一种方法就是使用Proxy，获取方法的时候，自动绑定this

/**
 * 静态方法
 * 类相当于实例的原型，所有在类中定义的方法，都会被继承
 * 如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是通过类
 * 来调用，这就称为“静态方法”
 */
class Foo {
    static classMethod() {
        return 'hello';
    }
}
Foo.classMethod(); //'hello'
var foo = new Foo();
foo.classMethod(); //TypeError: foo.classMethod is not a function

/**
 * 注意，如果静态方法包含this关键字，这个this指的是类，而不是实例
 */
class Foo {
    static bar() {
        this.baz();
    }
    static baz() {
        console.log('hello');
    }
    baz() {
        console.log('world');
    }
}
Foo.bar(); //'hello'
//看到这里，请记住this指向的区别，静态方法里的this，指的就是class

/**
 * 父类的静态方法，可以被子类继承，静态方法也是兄super对象上调用的
 */
class Foo {
    static classMethod() {
        return 'hello';
    }
}
class Bar extends Foo {
    static classMethod() {
        return super.classMethod() + 'foo';
    }
}
Bar.classMethod(); //'hello foo'

/**
 * 实例属性的新写法
 * 实例对象属性除了定义在constructor里，还可以定义在类的最顶层
 */
class Myclass {
    name;
    count = 0;
}

/**
 * 静态属性
 * 静态属性指的是Class本身的属性，即Class.Property
 * 而不是实例对象上的属性
 */
class Foo { }
Foo.prop = 1;
Foo.prop;  //1

/**
 * 对于上面的代码，新写法大大方便了静态属性的表达
 */
//老写法：
class Foo { }
Foo.prop = 1;
//新写法：
class Foo {
    static prop = 1;
}

/**
 * 私有方法和私有属性
 * 现在的解决方案
 */
class Widget {
    foo(baz) {
        bar.call(this, baz);
    }
}
function bar(baz) {
    return this.snaf = baz;
}
//foo是公开方法，内部调用了bar.call(this, baz)。这使得bar实际上成为了当前模块的私有方法。

/**
 * 私有属性的提案
 * 为class加了私有属性，方法就是在属性名之前，使用#表示
 */
class IncreasingCounter {
    #count = 0;
    get value() {
        console.log('Getting the current value!');
        return this.#count;
    }
    increment() {
        this.#count++;
    }
}

/**
 * new.target 属性
 * 可以确定构造函数是怎么调用的，如果使用new关键字调用，new.target会返回
 * 当前构造函数，如果不是，返回undefined
 */
function Person(name) {
    if (new.target !== undefined) {
        this.name = name;
    } else {
        throw new Error('必须使用 new 命令生成实例');
    }
}
// 另一种写法
function Person(name) {
    if (new.target === Person) {
        this.name = name;
    } else {
        throw new Error('必须使用 new 命令生成实例');
    }
}
var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错

/**
 * Class 内部调用new.target，返回当前 Class
 */
class Rectangle {
    constructor(length, width) {
        console.log(new.target === Rectangle);
        this.length = length;
        this.width = width;
    }
}
var obj = new Rectangle(3, 4); // 输出 true

/**
 * 组要注意的是，子类在继承父类时，new.target会返回子类
 */
class Rectangle {
    constructor(length, width) {
        console.log(new.target === Rectangle);
    }
}
class Square extends Rectangle {
    constructor(length) {
        super(length, width);
    }
}
var obj = new Square(3); //false

/**
 * 利用上面的特点，我们可以写出不能独立使用，必须继承后才能使用的类
 */
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error('本类不能实例化');
        }
    }
}
class Rectangle extends Shape {
    constructor(length, width) {
        super();
        // ...
    }
}
var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确