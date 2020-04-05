const { vdtr, isError } = require('./vdtr');

const reportMiddlewareFunctions = {
    validateReport: (req, res, next) => {
        const errors = vdtr(req.body, {
            reported: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Reported User ID is empty',
                    size: { max: 256, errmax: 'Reported User ID too long' },
                    objectid: 'Not a valid User ID(Reported)'
                }
            },
            reportType: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Report Type is empty',
                    reporttype: 'Invalid type'
                }
            },
            title: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Title is empty',
                    size: { max: 64, errmax: 'Title too long' }
                }
            },
            description: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Description is empty',
                    size: { max: 2056, errmax: 'Description too long' }
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },

    validateReportID: (req, res, next) => {
        const errors = vdtr(req.params, {
            reportID: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Report ID is empty',
                    objectid: 'Invalid report ID'
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },
};

module.exports = reportMiddlewareFunctions;