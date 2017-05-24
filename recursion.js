const fs = require('fs');

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
    // If we haven't iterated the entire array
    if (i < data.length) {
        // Do something that takes time
        setTimeout(function () {
            fs.appendFile('example.txt', data[i], function (err) {
                if (err) {
                    console.error(err)
                }
                if (!err) {
                    console.log('Wrote line ' + i);
                    recurse(i + 1)
                }
            })
        }, 1000);
    }
    // We have iterated the entire array
    if (i == data.length) {
        console.log('We are done!')
    }
};

recurse(0);
