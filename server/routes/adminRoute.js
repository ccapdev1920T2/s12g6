const express = require('express');
const router = express();
const csrfProtection = require('csurf')({ cookie: true });
const mw = {
    ...require('../middlewares/authMiddleware'),
    ...require('../middlewares/adminMiddleware')
};

module.exports = db => {
    const api = require('../api/admin')(db);

    router.get('/get', mw.verifyAdmin, mw.isAdmin, api.getAdmin);
    router.get('/auth', mw.verifyAdmin, api.isAdmin);
    router.get('/noauth', mw.verifyAdmin, api.noAdmin);

    router.post('/login', csrfProtection, mw.verifyAdmin, mw.isNotAdmin, mw.validateLogin, api.login);
    router.post('/logout', csrfProtection, mw.verifyAdmin, mw.isAdmin, api.logout);

    return router;
}