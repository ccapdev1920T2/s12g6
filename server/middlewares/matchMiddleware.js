const { vdtr, isError } = require('./vdtr');

const matchMiddlewareFunctions = {
    validateMatchID: (req, res, next) => {
        const errors = vdtr(req.body, {
            match: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Match id is empty',
                    objectid: 'Not a valid match id'
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },
};

module.exports = matchMiddlewareFunctions;