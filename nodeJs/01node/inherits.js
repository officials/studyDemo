var util = require('util');
function Person(name, age) {
    this.name = 'ddd';
    this.age = age;
}
Person.prototype.showName = function () {
    console.log(this.name);
}
function Girl(name,age) { 
    Person.call(this,name,age);
}
util.inherits(Girl, Person);
var baby = new Girl('qqq',45);
let { log } = console;
log(baby.name);
baby.showName();