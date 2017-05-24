This is a non-authoritative explaination of using Promises with Node.js. It is not meant to be a comprehensive document, but rather a primer to help getting started with them. See [resources](#resources) for further details.

# The Problem

```
var foo = function () {
    // Track execution time
    console.time('Execution');
    setTimeout(function () {
        console.log('foo')
    }, 500)
};

var bar = function () {
    setTimeout(function () {
        console.log('bar')
    }, 250)
};

var baz = function () {
    setTimeout(function () {
        console.log('baz');
        // Track execution time
        console.timeEnd('Execution');
    }, 501)
};

foo();
bar();
baz();
```

will results in

> bar    
> foo    
> baz    
> Execution: 504.746ms    

The functions execute out of order, but simultaneously, due to the asynchronous nature of Node.js. The is generally awesome, but sometimes we need to results of one function for another.

# The Solution
To solve the execution order issue, we can use a Promises.    
NOTE: [Promises](http://www.ecma-international.org/ecma-262/6.0/#sec-promise-constructor) come from the ECMAScript® 2015 Language Specification (ES6 specification) which JavaScript uses. It is not fully supported by all browsers, but **since Node.js runs server-side, we can use them**.

```
var Promise = require('promise');

var foo = function () {
    // Track execution time
    console.time('Execution');
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('foo');
            resolve();
        }, 500);
    });
    return promise;
};


var bar = function () {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('bar');
            resolve();
        }, 250);
    });
    return promise;
};

var baz = function () {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('baz');
            // Track execution time
            console.timeEnd('Execution');
            resolve();
        }, 501);
    });
    return promise;
};

foo().then(bar).then(baz);
```

Will result in:

> foo    
> bar    
> baz    
> Execution: 1267.004ms

## Resolve, Reject
From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise    
> A function that will be passed other functions via the arguments resolve and reject. The executor function is executed immediately by the Promise implementation which provides the resolve and reject functions (the executor is called before the Promise constructor even returns the created object). The resolve and reject functions are bound to the promise and calling them fulfills or rejects the promise, respectively. The executor is expected to initiate some asynchronous work and then, once that completes, call either the resolve or reject function to resolve the promise's final value or else reject it if an error occurred.

As Promises can be chained, we can pass data via the success (resolve) function, or signify a failure (reject).

```
var Promise = require('promise');

var foo = function () {
    // Track execution time
    console.time('Execution');
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('foo');
        }, 500);
    });
    return promise;
};

var bar = function (res) {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(res + ' bar');
        }, 250);
    });
    return promise;
};

var baz = function (res) {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(res + ' baz');
        }, 501);
    });
    return promise;
};

foo()
    .then(bar)
    .then(baz)
    // Do something with the final result (resolve)
    .then(function (res) {
        console.log(res);
        // Track execution time
        console.timeEnd('Execution');
    });
```

In the above example, we execute our three functions, passing a string between them, and then when executing them, we add a final `then` to act on the final result.

The result is:
> foo bar baz   
> Execution: 1265.252ms

### Catching errors
Whenever `reject` is called, the promise chain ceases to continue to be executed, and we can catch any error thrown with a final `catch`.

```
var Promise = require('promise');

var foo = function () {
    // Track execution time
    console.time('Execution');
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('foo');
        }, 500);
    });
    return promise;
};


var bar = function (res) {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error('We failed!'));
        }, 250);
    });
    return promise;
};

var baz = function (res) {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(res + ' baz');
        }, 501);
    });
    return promise;
};


foo()
    .then(bar)
    .then(baz)
    .then(function (res) {
        console.log(res);
        // Track execution time
        console.timeEnd('Execution');
    })
    .catch(function (err) {
        console.error(err);
        // Track execution time
        console.timeEnd('Execution');
    });
```

Will result in:

> [Error: We failed!]    
> Execution: 760.444ms
 

## Use in modules
Promises can be used in exported modules. A simple example is:
```
module.exports = {

    request: function (req, callback) {
        firstMethod(req)
            .then(secondMethod)
            .then(thirdMethod)
            .then(function () {
                callback(null, res)
            })
            .catch(function (err) {
                callback(err)
            })
    }
};
```

Where we return the success or failure of the promise chain, via a callback, to the caller.

## Don't break the chain

Something like the following will break the chain of passing data between the promises, but won't prevent them all from executing:

```
foo()
    .then(bar)
    .then(console.log) // Breaks the chain of passing data between promises
    .then(baz)
    .then(function (res) {
        console.log(res);
    })
    .catch(function (err) {
        console.error(err);
    });
```

# Resources
* https://www.promisejs.org/
* [How to Chain JavaScript Promises](https://html5hive.org/how-to-chain-javascript-promises/)
* [Express.js Production best practices: Promises ](https://expressjs.com/en/advanced/best-practice-performance.html#promises)
* [Staying Sane With Asynchronous Programming: Promises and Generators](http://colintoh.com/blog/staying-sane-with-asynchronous-programming-promises-and-generators)
* [Asynchronous Error Handling in Express with Promises](https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/)
