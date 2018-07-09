/*
import xx from './../../xx';
import name, { API } from '...';
export {
  a: 1,
  b: function(){},
};
export const API = {};
const d = {};
export default d;


// var let const
let name = '';
function a() {
  let name = '';
}

console.log(name);

const a = 123;

// object
var a = {
  b: 1,
  c: null,
};

var b = a.b;
var c = a.c;

const { b, c = 'defaultValue' } = a;

const a = {
  a: 1,
  b: 2,
};

const b = {
  c: 3,
  d: 4,
};
c = {
  a: a.a,
  b: a.b,
};

const c = {
  ...a,
  ...b,
};

const a = function(){};

const a = () => {};


// array
const a = [
  {a:1, value: '3'},
  {b:1, value: '4'},
  {b:1, value: '4'},
  {c:1, value: '5'},
];

a.forEach((item) => {});
a.forEach(function(item){});
cosnt b = a.map((v, index) => {return v.value;}); // [3,4,5]

a.map((v) => ({
  ...v,
  value: v.value + 1,
}));

a.pop();
a.shift();

a.unshift();
a.push();

a.find(v => v.value == 4); // {b:1, value: 4}
a.filter(v => v.value == 4); // [{b:1, value: 4},{b:1, value: 4}]


// es6

class Parent {};
class Child extends Parent {
  constructor(super){
    super();
  },
  getName(){},
  getName = () => {},
  getName = function(){},
  async function getName(){},
};


class Person {};

export default new Person();
export default Person;


// async await , Promise

let a = function(callback){
  setTimeout(funciton(){
      callback(123);
    }, 3000);
}

let b = function(callback){
  setTimeout(funciton(){
      callback(123);
    }, 3000);
}

let c = function(callback){
  setTimeout(funciton(){
      callback(123);
    }, 3000);
}

a(function(v){
  // v = 123
  b(function(v){
    // v = 123
    c(function(v){
      // v = 123
      
    })
  })
})

let a = function(){
  return new Promise(function(resolve, reject){
    // request
    setTimeout(funciton(){
      resolve(123);
    }, 3000);
  });
}

let b = function(){
  return new Promise(function(resolve, reject){
    // request
    setTimeout(funciton(){
      resolve(123);
    }, 3000);
  });
}

a().then(function(v){
  // v = 123
  reutrn b();
}).then(function(v){
  // b >> v = 123
  return c();
}).then(function(v){});

async function do() {
  // a
  const data1 = await a(); // data1 = 123
  // b
  const data2 = await b(); //data2 = 123
  //c
  const data3 = await c();
}


*/

