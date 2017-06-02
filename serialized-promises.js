var Promise = require('promise');

console.time('timer');

var fn1 = function (v) {
    return new Promise(function (resolve, reject) {
        console.log('fn1, iteration ' + v);
        resolve(v);
    });
};

var fn2 = function (v) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('fn2, iteration ' + v);
            resolve(v);
        }, 1000)
    });
};

var fn3 = function (v) {
    return new Promise(function (resolve, reject) {
        console.log('fn3, iteration ' + v);
        resolve(v);
    });
};

function recurse(i) {
    if (i < 100) {
        fn1(i)
            .then(fn2)
            .then(fn3)
            .then(function () {
                var mem    = process.memoryUsage();
                var heapKb = (mem.heapUsed * .001).toFixed(2);
                console.log('Memory: ' + heapKb + 'kB');
                recurse(i + 1)
            })
    }
    if (i == 100) {
        console.timeEnd('timer');
    }
}

recurse(0);
