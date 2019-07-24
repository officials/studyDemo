if (false) {
    var a = 1;
}
console.log(a);
//变量提升最外层


/**
 * ====================================================================
 */
//函数提升更加明显
console.log(test);  //function test(){console.log(123);}
var test = 1;
function test() {
    console.log(123);
}
console.log(test); //1  

/**
 * ====================================================================
 */

this.a = 20;
var test = {
    a: 40,
    init: function () {
        function go() {
            console.log(this.a);
        }
        go();
    }
}
test.init();
//在严格模式下，this不会指向window，this为undefined
//"use strict" 根据浏览器的不同，严格模式略有不同，有的浏览器写在全局就会限制所有
//如果将上面的go function return出来，就是不一样的结果，因为g被return了出来，就有了调用环境了
this.a = 20;
var test = {
    a: 40,
    init: function () {
        function go() {
            console.log(this.a);
        }
        return go;
    }
}
var result=test.init().bind(test);
result();  //40  

//接下来介绍软绑定、硬绑定
//软绑定：占位
var result = test.init().bind(undefined);
var result = test.init().bind(null);
result(); //20
//软绑定指向window

//硬绑定：
var result = test.init().bind(test);


/**
 * ====================================================================
 */

function fn() {
    console.log(this.length);  //表示当前页面iframe的个数
}
fn();//每个iframe的个数

{ } +[]  //0  因为{}和[]会被解析成0相加
console.log({} + []);  //'[object Object]'  ({}+[])成了表达式，执行'[object Object]'+""

(function (x) {
    delete x;
    return x;
})(1);
// 1
//delete只能delete属性，不能delete变量

/**
 * ====================================================================
 */

var a = function b() { }
//可以这样理解
b = function () { }
var a = b;
delete b

/**
 * =================================以下放练习的面试题===================================
 */
//请写出如下输出值，并写出把注释掉的代码取消注释的值，并解释为什么
this.a = 20;
var test = {
    a: 40,
    init: () => {
        console.log(this.a);
        function go() {
            //this.a=60;
            comsole.log(this.a);
        }
        go.prototype.a = 50;
        return go;
    }
}
// var p=test.init();20 因为是箭头函数，箭头函数认为对象不构成单独的作用域
//p(); //20  因为是window调用了p,所以this指向window
new (test.init())(); //20 50  p指向window，但是通过new关键字生成了构造函数实例，所以this指向实例对象



//请写出如下点击li的输出值，并用三种办法正确输出li里的数字
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
</ul>
    
var list_li = document.getElementsByTagName("li"); 
for (var i = 0;i < list_li.length; i++) {
    list_li[i].onclick = function() {
    console.log(i);
}
//第一种，就是我们熟悉的let、
//第二种，就是闭包
//第三种，就是直接使用this，我们直接看第三种
for (var i = 0;i < list_li.length; i++) {
    list_li[i].onclick = function() {
        console.log(this.innerHTML);
    }   
}



//写出输出值，并解释为什么
function test(m){
    m={v:5};
}
var m={k:30};
test(m); //undefined 这里m对象传到了function里，但是function里并没有使用m，而是直接赋值，
//这样并不改变m，除非m.v=5;这样的操作会改变m，因为是同一引用
alert(m.v); //undefined  因为m里不存在v



//写出一下代码的执行结果，并解释为什么，这里采坑了，明知道变量提升，但是没有注意函数执行
function yideng() {
console.log(1); }
(function () {if (false) {
    function yideng() { console.log(2);
} }
yideng();
})();
//yideng is not a function Error



//仔细思考如下代码运行结果，并解释为什么
var length=10;
function fn(){
    console.log(this.length);
}
var yideng={
    length:5,
    methed:function(fn){
        fn();
        arguments[0]();
    }
};
yideng.methed(fn,1);
//输出结果：10 2
//因为fn()是以参数传进去的，其实并不属于object,所以执行fn()时this指向window
//而执行arguments时，arguments是一个对象，this指向arguments，arguments的原型是yideng