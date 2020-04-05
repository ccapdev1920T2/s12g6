const moment = require('moment');

const LEGAL_AGE = 18;
const ALPHA_REGEX = /^[a-zA-Z]*$/;
const NAME_REGEX = /^[a-zA-Z &/.(),'\-]*$/
const NICKNAME_REGEX = /^[a-zA-Z0-9 &/.(),'!#$%&*+=?^_`{}\-]*$/;
const ADDRESS_REGEX = /^[a-zA-Z0-9 #.,;:'-°]*$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PHONE_REGEX = /^(0|63)9([0-9]){9,9}$/;
// const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&_.]).{8,}/;
const LOWER_ALPHA_REGEX = /[a-z]/;
const UPPER_ALPHA_REGEX = /[A-Z]/;
const NUMBER_REGEX = /[0-9]/;
const SYMBOL_REGEX = /[@$!%*#?&_.-]/;
const PASS_REGEXES = [ LOWER_ALPHA_REGEX, UPPER_ALPHA_REGEX, NUMBER_REGEX, SYMBOL_REGEX ];
const PASS_STRENGTH_MIN = 3;
const GENDER_REGEX = /^male|female|gay|lesbian|bi$/;
const GENDER_PREFERENCE_REGEX = /^m?f?g?l?b?$/; // mf, mfg, mg
const KEY_REGEX = /^([a-zA-Z0-9]){12,}/;
const OBJECT_ID_REGEX = /^([0-9a-fA-F]){24,24}$/;
const CHAT_ID_REGEX = /^([0-9a-fA-F]){24,24}-([0-9a-fA-F]){24,24}$/;
const REPORT_TYPE_REGEX = /^abusive chat|underaged user|sexual|spam|other$/;
const IMAGE_REGEX = /^[0-9]{13,13}.(png|jpg|jpeg|gif|tiff)$/;

const MATCH_KEYS = [ '_id', 'userInfo', 'images', 'dp' ];
const USER_INFO_KEYS = [ 'nickname' ]

const validatorFunctions = {
    minsize: (text, size) => text.length >= size,
    maxsize: (text, size) => text.length <= size,
    notempty: text => text,
    alpha: text => ALPHA_REGEX.test(text),
    name: name => NAME_REGEX.test(name),
    nickname: nick => NICKNAME_REGEX.test(nick),
    address: address => ADDRESS_REGEX.test(address),
    email: email => EMAIL_REGEX.test(email),
    phonenumber: number => PHONE_REGEX.test(number),
    // password: pass => PASSWORD_REGEX.test(pass),
    password: pass => {
        let strength = 0;
        let rgs = PASS_REGEXES.length;
        for (let i = 0; i < rgs; i++)
            if (PASS_REGEXES[i].test(pass))
                strength++;
        return strength >= PASS_STRENGTH_MIN
    },

    age: date => moment(Date.now()).diff(date, 'years') >= LEGAL_AGE, // s if the day has occurred or not and valid age
    gender: gender => GENDER_REGEX.test(gender) || gender.startsWith('other-'),
    genderpreference: gf => GENDER_PREFERENCE_REGEX.test(gf),
    image: image => IMAGE_REGEX.test(image),

    key: key => key.length > 12 ? KEY_REGEX.test(key) : false, // key first 12 must be in an alphabet
    objectid: id => OBJECT_ID_REGEX.test(id),
    chatid: id => CHAT_ID_REGEX.test(id),
    chatnotsameid: id => id.substring(0, 24) !== id.substring(25),

    reporttype: type => REPORT_TYPE_REGEX.test(type),

    arrnotempty: arr => arr instanceof Array ? arr.length > 0 : false,
    arrminsize: (arr, size) => arr instanceof Array ? arr.length >= size : false,
    arrmaxsize: (arr, size) => arr instanceof Array ? arr.length <= size : false,
    arrstring: arr => {
        let a;
        for (let i = 0; i < arr.length; i++) {
            a = arr[i];
            if (typeof(a) !== 'string' || !a)
                return false;
        }
        return true;
    },
    arrimage: arr => {
        let a;
        for (let i = 0; i < arr.length; i++) {
            a = arr[i];
            if (typeof(a) !== 'string' || !a || !IMAGE_REGEX.test(a))
                return false;
        }
        return true;
    }
}

module.exports = validatorFunctions;