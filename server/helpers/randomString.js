const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const len = alphabet.length - 1;

function random() {
    return Math.round(Math.random() * len);
}

let randomString = function(length) {
    let rs = '';
    for (let i = 0; i < length; i++) {
        rs += alphabet.charAt(random());
    }

    return rs;
}

module.exports = randomString;