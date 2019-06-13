/**
 * String.raw()
 * 该方法返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串
 */
String.raw`Hi\n${2 + 3}!`;
// 返回 "Hi\\n5!"
String.raw`Hi\u000A!`;
// 返回 "Hi\\u000A!"

/**
 * codePointAt()
 * 
 */
var s = "𠮷";
s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271

/**
 * 实例化方法
 * startWith() 返回布尔值 
 * endWith() 返回布尔值
 * includes() 返回布尔值
 */
let s = 'Hello world!';
s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
//这三个方法都支持第二个参数，表示开始搜索的位置
let s = 'Hello world!';
s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false

/**
 * 实例方法repeat()
 * repeat方法返回一个新字符串，表示将原字符串重复n次
 */
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""
//参数如果是小数，会被取整。
'na'.repeat(2.9) // "nana"

/**
 * 实例化方法
 * padStart() 接收两个参数，字符串要补齐的长度，变量填补的字符串，从首开始
 * padEnd() 接收两个参数，字符串要补齐的长度，变量填补的字符串，从尾开始
 */
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'
'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'

/**
 *  实例化方法
 *  trimStrat()  消除字符串头部的空格
 *  trimEnd() 消除字符串尾部的空格
 */
const s = '  abc  ';
s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"
