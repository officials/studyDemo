/**
 * 二进制和八进制的表示法
 * ES6 提供了二进制和八进制数值的新的写法，
 * 分别用前缀0b（或0B）和0o（或0O）表示。
 */

/**
 * Number.isFinite(), Number.isNaN()
 */
//Number.isFinite()用来检查一个数值是否为有限的（finite），
//即不是Infinity。
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false

/**
 * Number.isNaN()用来检查一个值是否为NaN
 */
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9 / NaN) // true
Number.isNaN('true' / 0) // true
Number.isNaN('true' / 'true') // true

/**
 * Number.parseInt(), Number.parseFloat()
 * 在es6中，将全局方法parseInt()和parseFloat()移植到了Number上
 * 行为完全保持不变
 */
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45
// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
//这样做的目的，就是逐步减少全局方法，使得语言逐步模块化
//就比如全局变量，不在挂载到window上

/**
 * Number.isInteger()用来判断一个数值是否为整数
 */
Number.isInteger(25) // true
Number.isInteger(25.1) // false

/**
 * 浮点数相加
 */
0.1 + 0.2
// 0.30000000000000004
0.1 + 0.2 - 0.3
// 5.551115123125783e-17
5.551115123125783e-17.toFixed(20)
// '0.00000000000000005551'

/**
 * 安全整数和 Number.isSafeInteger()
 * JavaScript 能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），
 * 超过这个范围，无法精确表示这个值。
 */
Math.pow(2, 53) // 9007199254740992
9007199254740992  // 9007199254740992
9007199254740993  // 9007199254740992
Math.pow(2, 53) === Math.pow(2, 53) + 1 // true
Number.isSafeInteger(1) //true
Number.isSafeInteger(1.2) //false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) //true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) //true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) //false

/**
 * Math对象的扩展
 * Math.trunc() 用于去除一个数的小数部分，返回整数部分
 */
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0

/**
 * Math.Sign() 判断一个数是正数，负数还是0
 *  参数为正数，返回+1；
    参数为负数，返回-1；
    参数为 0，返回0；
    参数为-0，返回-0;
    其他值，返回NaN。
 */
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN

/**
 * Math.cbrt() 用于计算一个数的立方根
 */
Math.cbrt(-1) // -1
Math.cbrt(0)  // 0
Math.cbrt(1)  // 1
Math.cbrt(2)  // 1.2599210498948734

/**
 * Math.imul方法返回两个数以 32 位带符号整数形式相乘的结果，
 * 返回的也是一个 32 位的带符号整数
 */
Math.imul(2,-2); //-4
Math.imul(2, 4)   // 8
Math.imul(-1, 8)  // -8
Math.imul(-2, -2) // 4

/**
 * 在js中，数学运算符带有**，表示次方
 */
2**3  //8
3**5 //243

/**
 * Math.hypot方法返回所有参数的平方和的平方根
 */
Math.hypot(3, 4);        // 5
Math.hypot(3, 4, 5);     // 7.0710678118654755
Math.hypot();            // 0
Math.hypot(NaN);         // NaN
Math.hypot(3, 4, 'foo'); // NaN
Math.hypot(3, 4, '5');   // 7.0710678118654755
Math.hypot(-3);          // 3
//3 的平方加上 4 的平方，等于 5 的平方

/**
 * 
 */