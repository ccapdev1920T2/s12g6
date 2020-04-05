const express = require('express');
const router = express.Router();
const csrfProtection = require('csurf')({ cookie: true });
const mw = {
    ...require('../middlewares/authMiddleware'),
    ...require('../middlewares/chatMiddleware'),
    ...require('../middlewares/matchMiddleware'),
};

const { chatImageUpload } = require('../middlewares/multerMiddleware');

module.exports = db => {
    const api = require('../api/chat')(db);
    
    // authentication
    router.get('/', mw.verifyToken, mw.isAuth, api.getInit);
    router.get('/all', mw.verifyAdmin, mw.isAdmin, api.getAllChats);

    router.post('/create', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateNewChat, api.createChat);
    router.post('/message/:chatID', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateMessage, api.postMessage);
    router.post('/image/:chatID', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateChatID, chatImageUpload.single('image'), api.postImage);

    router.patch('/read/:chatID', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateChatID, api.patchReadChat);

    router.delete('/delete/:chatID', csrfProtection, mw.verifyToken, mw.isAuth, mw.validateChatID, api.deleteChat);

    return router;
}