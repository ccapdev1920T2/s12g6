// TODO: change algorithm

const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private.key');
const PUBLIC_KEY = fs.readFileSync('./public.key.pub');

let jwtFunctions = {
    tokenizeUser: function(user) {
        return new Promise((resolve, reject) => {
            jwt.sign(user, PRIVATE_KEY, { algorithm: 'RS256' }, function(err, token) {
                err ? reject(err) : resolve(token);
            });
        });
    },

    verify: function(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, PUBLIC_KEY, { algorithm: 'RS256' }, function(err, decoded) {
                err ? reject(err) : resolve(decoded);
            });
        });
    }
}

module.exports = jwtFunctions;