const { vdtr, sanitizer, validator, process, isError } = require('./vdtr');

const CHIPS_MAX = 10;

const userMiddlewareFunctions = {
    validateLogin: (req, res, next) => {
        const errors = vdtr(req.body, {
            email: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Email should not be empty',
                    size: { max: 256, errmax: 'Email too long' },
                    email: 'Invalid email'
                }
            },
            pass: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Password should not be empty',
                    size: { max: 128, errmax: 'Password too long' }
                }
            },
            rememberMe: { sanitize: ['boolean'] }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },

    validateSendEmail: (req, res, next) => {
        const errors = vdtr(req.body, {
            email: {
                sanitize: ['trim'],
                validate: { 
                    notempty: 'Email should not be empty',
                    size: { max: 256, errmax: 'Email too long' },
                    email: 'Invalid email'
                }
            },
            phoneNumber: {
                sanitize: ['trim'],
                validate: { phonenumber: 'Invalid phonenumber' }
            },
            password: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Password should not be empty',
                    size: { 
                        min: 8, errmin: 'Password too short',
                        max: 128, errmax: 'Password too long'
                    },
                    password: 'Invalid password format'
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },

    validateKey: (req, res, next) => {
        const errors = vdtr(req.query, {
            key: {
                validate: {
                    notempty: 'Missing Key',
                    key: 'Invalid key'
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        req.body = process.key(req.query.key);
        next();
    },

    validateRegistion: (req, res, next) => {
        let { key } = req.body;
        
        key = sanitizer.trim(key);
        if (!key) return res.status(401).send('Missing Key');
        else if (!validator.objectid(key)) return res.status(401).send('Invalid Key');

        const errors = vdtr(req.body, {
            fname: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'First name should not be empty',
                    size: { max: 64, errmax: 'First name too long' },
                    name: 'Not a valid first name'
                }
            },
            lname: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Last name should not be empty',
                    size: { max: 32, errmax: 'Last name too long' },
                    name: 'Not a valid last name'
                }
            },
            nickname: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Nickname should not be empty',
                    size: { max: 64, errmax: 'Nick name too long' },
                    nickname: 'Not a valid nickname'
                }
            },
            gender: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Gender should not be empty',
                    size: { max: 32, errmax: 'Not a valid gender' },
                    gender: 'Not a valid gender'
                }
            },
            birthday: {
                sanitize: ['trim', 'birthday'],
                validate: {
                    notempty: 'Birthday',
                    age: 'You must be 18 or above'
                }
            },
            religion: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Religion should not be empty',
                    size: { max: 32, errmax: 'Not a valid gender' },
                    name: 'Not a valid religion'
                }
            },
            address: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Address should not be empty',
                    size: { max: 256, errmax: 'Not a valid gender' },
                    address: 'Not a valid address'
                }
            },
            personality: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Personality should not be empty',
                    size: { max: 512, errmax: 'Personality too long' }
                }
            },
            likes: {
                sanitize: ['arrayTrim'],
                validate: {
                    arrnotempty: 'Likes should not be empty',
                    arrsize: { max: CHIPS_MAX, err: 'Too many like keywords'},
                    arrstring: 'Likes have invalid values'
                }
            },
            dislikes: {
                sanitize: ['arrayTrim'],
                validate: {
                    arrnotempty: 'Dislikes should not be empty',
                    arrsize: { max: CHIPS_MAX, err: 'Too many dislike keywords'},
                    arrstring: 'Dislikes have invalid values'
                }
            },
            gpMale: { sanitize: ['boolean'] },
            gpFemale: { sanitize: ['boolean'] },
            gpGay: { sanitize: ['boolean'] },
            gpLesbian: { sanitize: ['boolean'] },
            gpBi: { sanitize: ['boolean'] },
        });

        if (isError(errors)) return res.status(401).send(errors);
        const { gpMale, gpFemale, gpGay, gpLesbian, gpBi } = req.body;
        req.body.genderpref = process.genderPref({ gpMale, gpFemale, gpGay, gpLesbian, gpBi });
        next();
    },

    validateInfo: (req, res, next) => {
        const errors = vdtr(req.body, {
            fname: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'First name should not be empty',
                    size: { max: 64, errmax: 'First name too long' },
                    name: 'Not a valid first name'
                }
            },
            lname: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Last name should not be empty',
                    size: { max: 32, errmax: 'Last name too long' },
                    name: 'Not a valid last name'
                }
            },
            nickname: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Nickname should not be empty',
                    size: { max: 64, errmax: 'Nick name too long' },
                    nickname: 'Not a valid nickname'
                }
            },
            birthday: {
                sanitize: ['trim', 'birthday'],
                validate: {
                    notempty: 'Birthday',
                    age: 'You must be 18 or above'
                }
            },
            religion: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Religion should not be empty',
                    size: { max: 32, errmax: 'Not a valid gender' },
                    name: 'Not a valid religion'
                }
            },
            address: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Address should not be empty',
                    size: { max: 256, errmax: 'Not a valid gender' },
                    address: 'Not a valid address'
                }
            },
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },

    validateInterest: (req, res, next) => {
        const errors = vdtr(req.body, {
            personality: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'Personality should not be empty',
                    size: { max: 512, errmax: 'Personality too long' }
                }
            },
            likes: {
                sanitize: ['arrayTrim'],
                validate: {
                    arrnotempty: 'Likes should not be empty',
                    arrsize: { max: CHIPS_MAX, err: 'Too many like keywords'},
                    arrstring: 'Likes have invalid values'
                }
            },
            dislikes: {
                sanitize: ['arrayTrim'],
                validate: {
                    arrnotempty: 'Dislikes should not be empty',
                    arrsize: { max: CHIPS_MAX, err: 'Too many dislike keywords'},
                    arrstring: 'Dislikes have invalid values'
                }
            },
            gpMale: { sanitize: ['boolean'] },
            gpFemale: { sanitize: ['boolean'] },
            gpGay: { sanitize: ['boolean'] },
            gpLesbian: { sanitize: ['boolean'] },
            gpBi: { sanitize: ['boolean'] },
        });

        if (isError(errors)) return res.status(401).send(errors);
        const { gpMale, gpFemale, gpGay, gpLesbian, gpBi } = req.body;
        req.body.genderpref = process.genderPref({ gpMale, gpFemale, gpGay, gpLesbian, gpBi });
        next();
    },

    validateDP: (req, res, next) => {
        const errors = vdtr(req.body, {
            dp: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'No DP Image sent',
                    image: 'Invalid Image Name'
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },

    validatePatchImages: (req, res, next) => {
        const errors = vdtr(req.body, {
            images: {
                sanitize: ['arrayTrim'],
                validate: {
                    arrnotempty: 'No Images sent',
                    arrsize: { max: 5, errmax: '5 files only to delete' },
                    arrimage: 'Invalid image name'
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },

    validateUserID: (req, res, next) => {
        const errors = vdtr(req.params, {
            userID: {
                sanitize: ['trim'],
                validate: {
                    notempty: 'User ID is empty',
                    objectid: 'Invalid user id'
                }
            }
        });

        if (isError(errors)) return res.status(401).send(errors);
        next();
    },
};

module.exports = userMiddlewareFunctions;