const express = require('express');
const router = express.Router();
const mw = {
    ...require('../middlewares/userMiddleware'),
    ...require('../middlewares/authMiddleware')
};
const csrfProtection = require('csurf')({ cookie: true });
const { userImageUpload } = require('../middlewares/multerMiddleware');

module.exports = db => {
    let api = require('../api/user')(db);

    router.get('/auth', mw.verifyToken, api.isAuth);
    router.get('/notauth', mw.verifyToken, api.isNotAuth);
    router.get('/verify', mw.verifyToken, mw.isNotAuth, mw.validateKey, api.getVerifySecret);
    router.get('/all', mw.verifyAdmin, mw.isAdmin, api.getAllUsers);
    router.get('/:userID', mw.verifyToken, mw.isAuth, mw.validateUserID, api.getUserByID);

    router.post('/login', csrfProtection, mw.verifyToken, mw.isNotAuth, mw.validateLogin, api.login);
    router.post('/logout', csrfProtection, mw.verifyToken, mw.isAuth, api.logout);
    router.post('/send-email', csrfProtection, mw.verifyToken, mw.isNotAuth, mw.validateSendEmail, api.postSendEmail);
    router.post('/create', csrfProtection, mw.verifyToken, mw.isNotAuth, mw.validateRegistion, api.postRegister);
    router.post('/dp/:userID', csrfProtection, mw.verifyToken, mw.isAuth, userImageUpload.single('dp'), api.postDP); //
    router.post('/image/:userID', csrfProtection, mw.verifyToken, mw.isAuth, userImageUpload.single('image'), api.postImage); //

    router.patch('/info/:userID', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateInfo, api.editProfileInfo); //
    router.patch('/interest/:userID', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateInterest, api.editProfileInterest); //
    router.patch('/dp/:userID', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateDP, api.editDP); //
    router.patch('/remove-img/:userID', csrfProtection, mw.verifyToken, mw.isAuth, mw.validatePatchImages, api.editRemoveImages); //
    router.patch('/warn/:userID', csrfProtection, mw.verifyAdmin, mw.isAdmin, mw.validateUserID, api.editWarning);

    router.delete('/delete/:userID', csrfProtection, mw.verifyToken, mw.isAuth, api.deleteAccount); //
    router.delete('/reported/:userID', csrfProtection, mw.verifyAdmin, mw.isAdmin, mw.validateUserID, api.deleteAccountByAdmin);

    return router;
};