const express = require('express');
const router = express();
const csrfProtection = require('csurf')({ cookie: true });
const mw = {
    ...require('../middlewares/authMiddleware'),
    ...require('../middlewares/reportMiddleware'),
};

module.exports = db => {
    const api = require('../api/report')(db);

    router.get('/all', mw.verifyAdmin, mw.isAdmin, api.getAllReports);

    router.post('/create', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateReport, api.postReport);

    router.patch('/dismiss/:reportID', csrfProtection, mw.verifyAdmin, mw.isAdmin, mw.validateReportID, api.patchDismissReport);

    return router;
}