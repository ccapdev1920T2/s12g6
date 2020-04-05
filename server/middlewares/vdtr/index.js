const validator = require('./validator');
const sanitizer = require('./sanitizer');
const process = require('./process');

// (body, fields: {fieldname: { sanitize: ['sanitize name'], validate: {validator: 'err'} })
const vdtr = (body, fields) => {
    let field, vdtrs, errors = {}, escape;

    for (let fn in fields) {
        field = fields[fn]
        if (field.sanitize) 
            field.sanitize.forEach(s => body[fn] = sanitizer[s](body[fn])); // sanitized
            
        vdtrs = field.validate;
        escape = false;
        for (v in vdtrs) { // returns all the keys which is only one
            switch(v) {
                case 'size':
                    if ('max' in vdtrs.size)
                        if (!validator.maxsize(body[fn], vdtrs.size.max)) {
                            errors[fn] = vdtrs.size.errmax;
                            escape = true;
                        }
                    if ('min' in vdtrs.size)
                        if (!validator.minsize(body[fn], vdtrs.size.min)) {
                            errors[fn] = vdtrs.size.errmin;
                            escape = true;
                        }
                break;
                case 'arrsize':
                    if ('max' in vdtrs.arrsize)
                        if (!validator.arrmaxsize(body[fn], vdtrs.arrsize.max)) {
                            errors[fn] = vdtrs.arrsize.errmax;
                            escape = true;
                        }
                    if ('min' in vdtrs.arrsize)
                        if (!validator.arrminsize(body[fn], vdtrs.arrsize.min)) {
                            errors[fn] = vdtrs.arrsize.errmin;
                            escape = true;
                        }
                break;
                default:
                    if (!validator[v](body[fn])) {
                        errors[fn] = vdtrs[v]; // error if validation is wrong
                        escape = true;
                    }
            }
            if (escape) break;
        }
    }

    return errors;
};

const isError = err => {
    for (let e in err)
        return true;
    return false;
};

module.exports = {
    vdtr,
    sanitizer,
    validator,
    process,
    isError
};