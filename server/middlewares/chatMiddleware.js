const { vdtr, process, isError } = require('./vdtr');

const chatMiddlewareFunctions = {
    validateNewChat: (req, res, next) => {
        console.log(req.body);
        const errors = vdtr(req.body, {
            // match: { // validate match
            //     sanitize: ['object'],
            //     validate: {
            //         notempty: 'Match is empty',
            //     }
            // },
            txt: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Message is empty',
                    size: { max: 256, errmax: 'Message is too long' }
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },

    validateMessage: (req, res, next) => {
        req.body.chatID = req.params.chatID;
        const errors = vdtr(req.body, {
            chatID: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'ChatID is empty',
                    chatid: 'Not a valid chat id',
                    chatnotsameid: 'Same id error'
                }
            },
            txt: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Message is empty',
                    size: { max: 256, errmax: 'Message is too long' }
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);

        req.userSender = process.extractSender(req.params.chatID, req.userData._id);
        if (!req.userSender) return res.status(401).send(errors);

        next();
    },

    validateChatID: (req, res, next) => {
        const errors = vdtr(req.params, {
            chatID: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'ChatID is empty',
                    chatid: 'Not a valid chat id',
                    chatnotsameid: 'Same id error'
                }
            },
        });

        if (isError(errors)) return res.status(401).send(errors);

        req.userSender = process.extractSender(req.params.chatID, req.userData._id);
        if (!req.userSender) return res.status(401).send(errors);

        next();
    },
};

module.exports = chatMiddlewareFunctions;