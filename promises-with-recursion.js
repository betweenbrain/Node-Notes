var Promise = require('promise');

var foo = function () {
    // Track execution time
    console.time('Execution');
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('foo');
            resolve();
        }, 500);
    });
};


var bar = function () {
    return new Promise(function (resolve, reject) {
        const data = [
            'foo',
            'bar',
            'baz',
            'qux',
            'quux',
            'quuz',
            'corge',
            'grault',
            'garply',
            'waldo',
            'fred',
            'plugh',
            'xyzzy',
            'thud'
        ];

        const recurse = function (i) {
            if (i < data.length) {
                setTimeout(function () {
                    console.log(data[i]);
                    recurse(i + 1)
                }, 1000);
            }
            if (i == data.length) {
                resolve();
                console.log('We are done!')
            }
        };

        recurse(0);
    });
};

var baz = function () {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('baz');
            // Track execution time
            console.timeEnd('Execution');
            resolve();
        }, 501);
    });
};

foo()
    .then(bar)
    .then(baz);
