const { vdtr, isError } = require('./vdtr');

module.exports = {
    validateLogin: (req, res, next) => {
        const errors = vdtr(req.body, {
            user: {
                sanitize: ['trim'],
                validate: { 
                    notempty: 'User should not be empty',
                    size: { max: 256, errmax: 'Email too long' }
                }
            },
            pass: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Pass should not be empty',
                    size: { max: 128, errmax: 'Password too long' }
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    }
};