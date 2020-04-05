

const { ObjectId } = require('mongodb');
const sendEmail = require('../helpers/sendEmail');
const randomString = require('../helpers/randomString');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('../helpers/jwt');
const fsp = require('fs').promises;
const fse = require('fs-extra');

const saltRounds = 8; // config
const WEEK = 1000 * 60 * 60 * 24 * 7;
const HALF_YEAR = 1000 * 60 * 60 * 24 * 30 * 6;
const KEY = process.env.ENCRYPT_KEY;
const cookieConfig = {
    httpOnly: true,
    secure: false, // edit this
    signed: true
};

// TODO: change this
function encrypt(text) {
    let cipher = crypto.createCipher('aes-256-cbc', KEY);
    let crypted = cipher.update(text, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
}

// TODO: change this
function decrypt(text) {
    let decipher = crypto.createDecipher('aes-256-cbc', KEY);
    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}

const userApi = db => {
    return {
        ////// GET
        getVerifySecret: (req, res) => {
            // get secret from params
            let id;
            try {
                id = ObjectId(decrypt(req.body.key));
            } catch (err) {
                return res.status(500).send(err.message);
            }

            // find id in the database
            db.collection('verify').findOne({ '_id': id })
                .then(user => {
                    if (!user) {
                        throw {
                            msg: 'Confirmation Expired',
                            status: 440
                        };
                    }

                    if (user.secret !== req.body.secret) {
                        throw {
                            msg: 'Wrong Credentials',
                            status: 401
                        };
                    }

                    return res.status(200).send({
                        id: id.toString()
                    });
                }).catch(err => {
                    console.log(err);
                    if (err.status !== 500)
                        return res.status(err.status).send(err.msg);
                    return res.status(500).send(err.message);
                });
        },

        isAuth: (req, res) => req.userData ? res.status(200).send() : res.status(403).send(req.error),
        isNotAuth: (req, res) => req.userData ? res.status(403).send(req.error) : res.status(200).send(),

        getAllUsers: (req, res) => {
            db.collection('users').find({}, { projection: { _id: 1, 'userInfo.fname': 1, 'userInfo.lname': 1, email: 1 } }).toArray()
                .then(doc => {
                    return res.status(200).send(doc);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        getUserByID: (req, res) => {
            const { userID } = req.params;

            db.collection('users').findOne({ _id: ObjectId(userID) })
                .then(user => {
                    return res.status(200).send(user);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                })
        },

        ////// POST
        login: (req, res) => {
            let { email, pass, rememberMe } = req.body;
            let user;

            db.collection('users').findOne({ email })
                .then(userDoc => {
                    if (!userDoc) {
                        throw {
                            err: { email: 'Email does not exist' },
                            status: 401
                        };
                    }

                    user = userDoc;
                    // compare password
                    return bcrypt.compare(pass, user.pass);
                }).then(result => {
                    if (!result) {
                        // check for images if empty else redirect user to upload image
                        throw {
                            err: { pass: 'Password Mismatch' },
                            status: 401
                        }
                    }

                    return jwt.tokenizeUser({ 
                        ...user,
                        maxAge: WEEK
                    });
                }).then(token => {
                    let addConfig = {};
                    if (rememberMe) {
                        addConfig.maxAge = HALF_YEAR;
                    }

                    return res.status(200)
                        .header('Access-Control-Allow-Credentials', true)
                        .header('Access-Control-Allow-Origin', req.headers.origin)
                        .header('Access-Control-Allow-Methods', 'GET,OPTIONS')
                        .header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
                        .cookie('token', token, {
                            ...cookieConfig,
                            ...addConfig
                        })
                        .send();
                }).catch(err => {
                    console.log(err);
                    if (err.status === 401 && err.err)
                        return res.status(err.status).send(err.err);
                    return res.status(500).send('Error has occured, try to login again');
                });
        },

        logout: (req, res) => res.status(200).clearCookie('token').end(),

        postSendEmail: (req, res) => {
            let { email, phoneNumber, password } = req.body;
            let secret = randomString(12);
            
            let promise1 = db.collection('users').findOne({ email });
            let promise2 = bcrypt.genSalt(saltRounds);

            Promise.all([promise1, promise2])
                .then(([userDoc, salt]) => {
                    if (userDoc) {
                        throw {
                            err: { email: 'Email is already taken' },
                            status: 401
                        };
                    }

                    return bcrypt.hash(password, salt);
                }).then(pass => {
                    // store the user in the verify collection
                    // let createdAt = new Date();
                    // createdAt = new Date(createdAt.getTime() + 1000 * 60 * 30);
                    return db.collection('verify').findOneAndUpdate(
                        { email },
                        {
                            $set: {
                                createdAt: new Date(),
                                email,
                                phoneNumber,
                                pass
                            },
                            $setOnInsert: {
                                secret
                            }
                        },
                        {
                            upsert: true,
                            returnNewDocument: true
                        }
                    );
                }).then(doc => {
                    let key;
                    if (doc.value) {
                        key = encrypt(doc.value._id.toString());
                        secret = doc.value.secret;
                    } else {
                        key = encrypt(doc.lastErrorObject.upserted.toString());
                    }

                    let url = `http://localhost:8080/register/verify?key=${secret}-${key}`;
                    let message = `Hello ${email},
Welcome to Anispark
            
Your link is: ${url}`;
                    return sendEmail(email, 'Confirm', message)
                }).then(msg => {
                    return res.status(200).send(msg);
                }).catch(err => {
                    console.log(err);
                    if (err.status && err.err)
                        return res.status(err.status).send(err.err);
                    return res.status(500).send(err);
                });
        },

        postRegister: (req, res) => {
            let { fname, lname, nickname, gender, birthday, religion, address, personality, likes, dislikes, genderpref } = req.body;
            let id = ObjectId(req.body.key);
            let user;

            db.collection('users').findOne({ '_id': id })
                .then(doc => {
                    if (doc) {
                        throw {
                            msg: 'Email already exist',
                            status: 401
                        };
                    }
                    return db.collection('verify').findOne({ '_id': id });
                }).then(doc => {
                    if (!doc) {
                        throw {
                            msg: 'Session Expired',
                            status: 440
                        };
                    }

                    const { email, phoneNumber, pass } = doc;
                    
                    user = {
                        email,
                        pass,
                        phoneNumber,
                        userInfo: {
                            fname,
                            lname,
                            nickname,
                            gender,
                            birthday,
                            religion,
                            address,
                            personality,
                            likes,
                            dislikes,
                            genderpref
                        },
                        images: [],
                        dp: 'girl.jpg' // default
                    }

                    // create document
                    return db.collection('users').insertOne(user);
                }).then(userDoc => {
                    user._id = userDoc.insertedId.toString();
                    let promise1 = db.collection('verify').deleteOne({ '_id': id});
                    let promise2 = jwt.tokenizeUser({ 
                        ...user,
                        ignoreExpiration: true // edit this
                    });

                    return Promise.all([promise1, promise2]);
                }).then(values => {
                    let token = values[1];
                    
                    return res.status(201)
                        .header('Access-Control-Allow-Credentials', true)
                        .header('Access-Control-Allow-Origin', req.headers.origin)
                        .header('Access-Control-Allow-Methods', 'GET,OPTIONS')
                        .header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
                        .cookie('token', token, cookieConfig)
                        .send(user._id); // user id
                }).catch(err => {
                    console.log(err);
                    if (err.status && err.msg)
                        return res.status(err.status).send(err.msg);
                    return res.status(500).send(err);
                });
        },

        postDP: (req, res) => {
            const { filename } = req.file;
            
            db.collection('users').updateOne(
                    { _id: ObjectId(req.userData._id) },
                    {
                        $set: { dp: filename },
                        $push: { images: filename }
                    }
                ).then(doc => {
                    req.userData.dp = filename;
                    req.userData.images.push(filename);
                
                    return jwt.tokenizeUser({ 
                        ...req.userData,
                        ignoreExpiration: true // edit this
                    });
                }).then(token => {
                    let addConfig = {};
                    if (req.userData.rememberMe)
                        addConfig.maxAge = HALF_YEAR;
                    
                    return res.status(201)
                        .header('Access-Control-Allow-Credentials', true)
                        .header('Access-Control-Allow-Origin', req.headers.origin)
                        .header('Access-Control-Allow-Methods', 'GET,OPTIONS')
                        .header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
                        .cookie('token', token, {
                            ...cookieConfig,
                            ...addConfig
                        })
                        .send(filename);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        postImage: (req, res) => {
            const { filename } = req.file;

            db.collection('users').updateOne(
                    { '_id': ObjectId(req.userData._id) },
                    { $push: { images: filename } }
                ).then(doc => {
                    req.userData.images.push(filename);
                    
                    return jwt.tokenizeUser({ 
                        ...req.userData,
                        ignoreExpiration: true // edit this
                    });
                }).then(token => {
                    let addConfig = {};
                    if (req.userData.rememberMe)
                        addConfig.maxAge = HALF_YEAR;

                    return res.status(201)
                        .header('Access-Control-Allow-Credentials', true)
                        .header('Access-Control-Allow-Origin', req.headers.origin)
                        .header('Access-Control-Allow-Methods', 'GET,OPTIONS')
                        .header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
                        .cookie('token', token, {
                            ...cookieConfig,
                            ...addConfig
                        })
                        .send(filename);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        ////// PATCH
        editProfileInfo: (req, res) => {
            let { fname, lname, nickname, gender, birthday, religion, address } = req.body;
            let updatedInfo = { fname, lname, nickname, gender, birthday, religion, address };
            let dataKeys = Object.keys(updatedInfo);
            let update = {};
            let same = true;

            // check if the user data are the same
            for (let k = 0; k < dataKeys.length; k++) {
                if (req.userData.userInfo[dataKeys[k]] !== updatedInfo[dataKeys[k]]) {
                    req.userData.userInfo[dataKeys[k]] = updatedInfo[dataKeys[k]];
                    update[`userInfo.${dataKeys[k]}`] = updatedInfo[dataKeys[k]];
                    same = false;
                }
            }
            
            if (same) return res.status(401).end();

            db.collection('users').updateOne(
                {_id: ObjectId(req.userData._id) },
                { $set: update }
                ).then(response => {
                    delete req.userData.ignoreExpiration;
                    delete req.userData.iat;

                    // update the jwt token
                    return jwt.tokenizeUser({
                        ...req.userData, // edit this because of expiration
                        maxAge: WEEK
                        // ignoreExpiration: true // TODO: edit this
                    });
                }).then(token => {
                    let addConfig = {};
                    if (req.userData.rememberMe) {
                        addConfig.maxAge = HALF_YEAR;
                    }

                    return res.status(200)
                        .header('Access-Control-Allow-Credentials', true)
                        .header('Access-Control-Allow-Origin', req.headers.origin)
                        .header('Access-Control-Allow-Methods', 'GET,OPTIONS')
                        .header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
                        .cookie('token', token, {
                            ...cookieConfig,
                            ...addConfig
                        })
                        .send(updatedInfo);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).send();
                });
        },

        editProfileInterest: (req, res) => {
            let { personality, likes, dislikes, genderpref } = req.body;
            let updatedInfo = { personality, likes, dislikes, genderpref };
            let dataKeys = Object.keys(updatedInfo);
            let update = {};
            let same = true;

            // check if the user data are the same
            for (let k = 0; k < dataKeys.length; k++) {
                if (req.userData.userInfo[dataKeys[k]] !== updatedInfo[dataKeys[k]]) {
                    req.userData.userInfo[dataKeys[k]] = updatedInfo[dataKeys[k]];
                    update[`userInfo.${dataKeys[k]}`] = updatedInfo[dataKeys[k]];
                    same = false;
                }
            }
            
            if (same) return res.status(401).send();

            db.collection('users').updateOne(
                {_id: ObjectId(req.userData._id) },
                {
                    $set: update
                }).then(doc => {
                    delete req.userData.ignoreExpiration;
                    delete req.userData.iat;

                    // update the jwt token
                    return jwt.tokenizeUser({
                        ...req.userData, // edit this because of expiration
                        maxAge: WEEK
                        // ignoreExpiration: true // TODO: edit this
                    });
                }).then(token => {
                    let addConfig = {};
                    if (req.userData.rememberMe) {
                        addConfig.maxAge = HALF_YEAR;
                    }

                    return res.status(200)
                        .header('Access-Control-Allow-Credentials', true)
                        .header('Access-Control-Allow-Origin', req.headers.origin)
                        .header('Access-Control-Allow-Methods', 'GET,OPTIONS')
                        .header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
                        .cookie('token', token, {
                            ...cookieConfig,
                            ...addConfig
                        })
                        .send(updatedInfo);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        editDP: (req, res) => {
            const { dp } = req.body;

            db.collection('users').findOneAndUpdate(
                    { _id: ObjectId(req.userData._id) },
                    { $set: { dp: req.body.dp }},
                    { returnOriginal: false }
                ).then(user => {
                    user = user.value;

                    return jwt.tokenizeUser({
                        ...user, // edit this because of expiration
                        maxAge: WEEK
                        // ignoreExpiration: true // TODO: edit this
                    });
                }).then(token => {
                    let addConfig = {};
                    if (req.userData.rememberMe) {
                        addConfig.maxAge = HALF_YEAR;
                    }

                    return res.status(200)
                        .header('Access-Control-Allow-Credentials', true)
                        .header('Access-Control-Allow-Origin', req.headers.origin)
                        .header('Access-Control-Allow-Methods', 'GET,OPTIONS')
                        .header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
                        .cookie('token', token, {
                            ...cookieConfig,
                            ...addConfig
                        })
                        .send(dp);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        // validate images
        editRemoveImages: async (req, res) => {
            let id = req.userData._id;
            let { images } = req.body;
            let path;
            let removed = [];
            let notRemoved = 0;

            try {
                let user = await db.collection('users').findOneAndUpdate(
                    { _id: ObjectId(id) },
                    { $pullAll: { images } },
                    { returnOriginal: false }
                );

                user = user.value;

                for (let i = 0; i < images.length; i++) {
                    if (!user.images.includes(images[i])) {
                        removed.push(images[i]);
                        path = `./images/users/${id}/${images[i]}`;
                        await fsp.unlink(path)
                            .catch(err => {
                                console.log(err);
                                notRemoved++;
                            });
                    }
                }

                let token = await jwt.tokenizeUser({
                    ...user, // edit this because of expiration
                    maxAge: WEEK
                    // ignoreExpiration: true // TODO: edit this
                });

                let addConfig = {};
                if (req.userData.rememberMe)
                    addConfig.maxAge = HALF_YEAR;

                return res.status(200)
                    .header('Access-Control-Allow-Credentials', true)
                    .header('Access-Control-Allow-Origin', req.headers.origin)
                    .header('Access-Control-Allow-Methods', 'GET,OPTIONS')
                    .header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
                    .cookie('token', token, {
                        ...cookieConfig,
                        ...addConfig
                    })
                    .send(removed);
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        },

        editWarning: (req, res) => {
            const { userID } = req.params;

            db.collection('users').findOneAndUpdate(
                    { _id: ObjectId(userID) },
                    { $inc: { warning: 1 }}
                ).then(doc => {
                    return res.status(200).send(userID);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).send(err);
                });
        },

        /////// DELETE
        deleteAccount: (req, res) => {
            let user;
            db.collection('users').findOneAndDelete({ _id: ObjectId(req.userData._id) })
                .then(({ value }) => {
                    user = value;
                    let userID = user._id.toString();
                    let p1 = fse.move(`./images/users/${user._id.toString()}`, `./images/deleted/users/${userID}`);
                    // delete all traces of user in the db
                    let p2 = db.collection('chats').deleteMany({ _id: { $regex: userID } }); // chats folder not deleted
                    let p3 = db.collection('matchLists').findOneAndDelete({ _id: user._id });

                    delete user.pass;
                    delete user.images;
                    delete user.dp;
                    user.createdAt = Date.now();

                    let p4 = db.collection('deleted').insertOne(user); // promise

                    return Promise.all([p1, p2, p3, p4]);
                }).then(([,,{ value }]) => {
                    // TODO: test this
                    console.log('value');
                    console.log(value);

                    if (!value)
                        return Promise.resolve();

                    let p1, p2;
                    if (value.list && value.list.length > 0)
                        p1 = db.collection('matchLists').updateMany(
                                { _id: { $in: value.list } },
                                { $pull: { list: user._id }}
                            );
                    if (value.unmatch && value.unmatch.length > 0)
                        p2 = db.collection('matchLists').updateMany(
                                { _id: { $in: value.unmatch } },
                                { $pull: { unmatch: user._id }}
                            );
                    
                    if (p1 && p2) 
                        return Promise.all([p1, p2]);
                    else if (p1)
                        return p1;
                    else if (p2)
                        return p2;
                    else
                        return Promise.resolve();
                }).then(() => {
                    return res.status(204)
                        .clearCookie('token')
                        .send();
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
            });
        },

        deleteAccountByAdmin: (req, res) => {
            const { userID } = req.params;
            db.collection('users').findOneAndDelete({ _id: ObjectId(userID) })
                .then(({ value }) => {
                    user = value;
                    let p1 = fse.move(`./images/users/${user._id.toString()}`, `./images/deleted/users/${userID}`);
                    // delete all traces of user in the db
                    let p2 = db.collection('chats').deleteMany({ _id: { $regex: userID } }); // chats folder not deleted
                    let p3 = db.collection('matchLists').findOneAndDelete({ _id: user._id });

                    delete user.pass;
                    delete user.images;
                    delete user.dp;
                    user.createdAt = Date.now();

                    let p5 = db.collection('deleted').insertOne(user); // promise

                    return Promise.all([p1, p2, p3, p4, p5]);
                }).then(([,,{ value }]) => {
                    // TODO: test this
                    console.log('value');
                    console.log(value);

                    if (!value)
                        return Promise.resolve();

                    let p1, p2;
                    if (value.list && value.list.length > 0)
                        p1 = db.collection('matchLists').updateMany(
                                { _id: { $in: value.list } },
                                { $pull: { list: user._id }}
                            );
                    if (value.unmatch && value.unmatch.length > 0)
                        p2 = db.collection('matchLists').updateMany(
                                { _id: { $in: value.unmatch } },
                                { $pull: { unmatch: user._id }}
                            );
                    
                    if (p1 && p2) 
                        return Promise.all([p1, p2]);
                    else if (p1)
                        return p1;
                    else if (p2)
                        return p2;
                    else
                        return Promise.resolve();
                }).then(() => {
                    return res.status(200).send(userID);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).send(err);
                });
        },
    };
};

module.exports = userApi;