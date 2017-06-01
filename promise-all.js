var promises = [];
var Promise  = require('promise');

console.time('timer');

var fn1 = function (v) {
    return new Promise(function (resolve, reject) {
        console.log('fn1, iteration ' + v);
        resolve();
    });
};

var fn2 = function (v) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('fn2, iteration ' + v);
            resolve();
        }, 1000)
    });
};

var fn3 = function (v) {
    return new Promise(function (resolve, reject) {
        console.log('fn3, iteration ' + v);
        resolve();
    });
};

for (var i = 0; i < 1000; i++) {
    promises.push(fn1(i));
    promises.push(fn2(i));
    promises.push(fn3(i));

    var mem    = process.memoryUsage();
    var heapKb = (mem.heapUsed * .001).toFixed(2);
    console.log('Memory: ' + heapKb + 'kB');
}

var results = Promise.all(promises);

results.then(function () {
    console.timeEnd('timer');
}).catch(function (err) {
    console.log(err)
});
