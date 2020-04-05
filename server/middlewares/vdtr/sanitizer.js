const moment = require('moment');

const sanitizerFunctions = {
    trim: text => typeof(text) === 'string' ? text.trim() : '',
    arrayTrim: arr => arr instanceof Array ?
                        arr.map(a => typeof(a) === 'string' ? a.trim() : '') :
                        (typeof(arr) === 'string' ? [ arr ] : []),
    object: obj => typeof(obj) === 'object' ? obj : null,
    boolean: bool => typeof(bool) === 'boolean' && bool === true ? bool : undefined,
    birthday: date => date ? moment(date).format('YYYY-MM-DD') : '',
};

module.exports = sanitizerFunctions;