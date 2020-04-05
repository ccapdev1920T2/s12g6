const express = require('express');
const router = express();
const csrfProtection = require('csurf')({ cookie: true });
const mw = {
    ...require('../middlewares/authMiddleware'),
    ...require('../middlewares/matchMiddleware'),
};

module.exports = db => {
    const api = require('../api/match')(db);

    router.get('/', mw.verifyToken, mw.isAuth, api.getMatches);

    router.post('/unmatch', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateMatchID, api.unmatchMatch);

    return router;
};