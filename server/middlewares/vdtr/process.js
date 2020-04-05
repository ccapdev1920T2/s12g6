const GENDERPREF = {
    Male: 'm',
    Female: 'f',
    Gay: 'g',
    Lesbian: 'l',
    Bi: 'b'
};

const process = {
    key: key => { // returns an object of key and secret
        return {
            secret: key.substring(0, 12),
            key: key.substring(13)
        };
    },

    genderPref: gp => {
        let genderpref = '';
        for (g in GENDERPREF)
            if (gp[`gp${g}`])
                genderpref += GENDERPREF[g];
        return genderpref;
    },

    extractSender: (chatID, userID) => {
        if (chatID.substring(0, 24) === userID)
            return 'u1';
        else if (chatID.substring(25) === userID)
            return 'u2';
        else
            return null;
    }
};

module.exports = process;