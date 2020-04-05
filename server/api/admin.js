const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

const cookieConfig = {
    httpOnly: true,
    secure: false, // edit this
    signed: true
};

const adminApi = db => {
    return {
        getAdmin: (req, res) => {
            const { user } = req.admin;
            return res.status(200).send(user);
        },

        isAdmin: (req, res) => req.admin ? res.status(204).end() : res.status(403).end(),
        noAdmin: (req, res) => req.admin ? res.status(403).end() : res.status(204).end(),

        login: (req, res) => {
            const { user, pass } = req.body;
            let admin;

            db.collection('admins').findOne({ user })
                .then(doc => {
                    if (!doc) {
                        throw {
                            msg: { user: 'User does not exist' },
                            status: 401
                        };
                    }

                    admin = doc;
                    // compare password
                    return bcrypt.compare(pass, admin.pass);
                }).then(result => {
                    if (!result) {
                        // check for images if empty else redirect user to upload image
                        throw {
                            msg: { pass: 'Password Mismatch' },
                            status: 401
                        }
                    }

                    return jwt.tokenizeUser({ 
                        ...admin,
                        ignoreExpiration: true // edit this
                    });
                }).then(token => {
                    return res.status(200)
                        .header('Access-Control-Allow-Credentials', true)
                        .header('Access-Control-Allow-Origin', req.headers.origin)
                        .header('Access-Control-Allow-Methods', 'GET,OPTIONS')
                        .header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
                        .cookie('admin', token, cookieConfig)
                        .send();
                }).catch(err => {
                    console.log(err);
                    if (err.msg && err.status) {
                        return res.status(err.status).send(err.msg);
                    }
                    return res.status(500).send('Error has occured, try to login again');
                });
        },

        logout: (req, res) => res.status(200).clearCookie('admin').end(),
    }
};

module.exports = adminApi;