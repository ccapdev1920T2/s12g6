const jwt = require('../helpers/jwt');

module.exports = {
    isAuth: (req, res, next) => req.userData ? next() : res.status(403).end(),
    isNotAuth: (req, res, next) => req.userData ? res.status(403).end() : next(),
    isAdmin: (req, res, next) => req.admin ? next() : res.status(403).end(),
    isNotAdmin: (req, res, next) => req.admin ? res.status(403).end() : next(),

    verifyToken: (req, res, next) => {
        let { token } = req.signedCookies;
        if (!token) {
            req.userData = undefined;
            return next();
        }

        jwt.verify(token)
            .then(decoded => req.userData = decoded)
            .catch(err => req.userData = undefined)
            .finally(() => next());
    },


    verifyAdmin: (req, res, next) => {
        let { admin } = req.signedCookies;
        if (!admin) {
            req.admin = undefined;
            return next();
        }

        jwt.verify(admin)
            .then(decoded => req.admin = decoded)
            .catch(err => req.admin = undefined)
            .finally(() => next());
    },
}