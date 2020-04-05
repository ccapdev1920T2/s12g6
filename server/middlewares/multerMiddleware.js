const multer = require('multer');
const fsp = require('fs').promises;
const path = require('path');

const userStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = `./images/users/${req.userData._id}`;
        fsp.access(dir)
            .then(() => cb(null, dir))
            .catch(() => fsp.mkdir(dir).then(() => cb(null, dir)));
    },
    
    filename: function(req, file, cb) {
        // check filetype
        const filetypeRegex = /jpeg|jpg|png|gif|tiff/;
        const extname = path.extname(file.originalname).toLowerCase();
        
        if (filetypeRegex.test(extname) && filetypeRegex.test(file.mimetype)) {
            cb(null, Date.now() + extname);
        } else {
            cb('File should be an image');
        }
    }
});

const chatStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = `./images/chats/${req.params.chatID}`;
        fsp.access(dir)
            .then(() => cb(null, dir))
            .catch(() => fsp.mkdir(dir, err => cb(err, dir)));
    },
    
    filename: function(req, file, cb) {
        // check filetype
        const filetypeRegex = /jpeg|jpg|png|gif/;
        const extname = path.extname(file.originalname).toLowerCase();
        
        if (filetypeRegex.test(extname) && filetypeRegex.test(file.mimetype)) {
            cb(null, Date.now() + extname);
        } else {
            cb('File should be an image');
        }
    }
});

const userImageUpload = multer({ storage: userStorage });
const chatImageUpload = multer({ storage: chatStorage });
module.exports = {
    userImageUpload,
    chatImageUpload
};