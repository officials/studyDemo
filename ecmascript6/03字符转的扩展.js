/**
 * es6加强了对Unicode的支持，允许采用\uxxxx形式表示一个字符，
 * 其中xxxx表示字符的Unicode码点
 */
"\u0061"
// "a"

//但是，这种表示法只限于码点在\u0000~\uFFFF之间的字符。
//超出这个范围的字符，必须用两个双字节的形式表示。
"\uD842\uDFB7"
// "𠮷"
"\u20BB7"
// " 7"

//ES6 对这一点做出了改进，只要将码点放入大括号，就能正确解读该字符。
"\u{20BB7}"
// "𠮷"

"\u{41}\u{42}\u{43}"
// "ABC"

let hello = 123;
hell\u{ 6F } // 123

'\u{1F680}' === '\uD83D\uDE80'
// true

/**
 * 接下来，开始记不无聊的知识
 * 字符串的遍历器
 */
for (let codePoint of 'foo') {
    console.log(codePoint)
}

/**
 * 模板字符串
 * 模板字符串（template string）是增强版的字符串，用反引号（`）标识。
 * 它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。
 */
let x = 1;
let y = 2;
`${x} + ${y} = ${x + y}`

/**
 * 当然，在模板字符串中还可以执行函数
 */
function fn() {
    return "Hello World";
}
`foo ${fn()} bar`
// foo Hello World bar

/**
 * 标签模板
 */
alert`123`
// 等同于
alert(123)

/**
 * “标签模板”的一个重要应用，就是过滤 HTML 字符串，防止用户输入恶意内容。
 */
let message =
    SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
    let s = templateData[0];
    for (let i = 1; i < arguments.length; i++) {
        let arg = String(arguments[i]);

        // Escape special characters in the substitution.
        s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Don't escape special characters in the template.
        s += templateData[i];
    }
    return s;
}