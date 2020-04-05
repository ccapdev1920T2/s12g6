const { ObjectId } = require('mongodb');

const GENDERPREF = {
    male: 'm',
    female: 'f',
    gay: 'g',
    lesbian: 'l',
    bi: 'b',
};

const matchApi = db => {
    return {
        getMatches: function(req, res) {
            const user = req.userData;

            // not in match list or unmatch
            let promise = db.collection('matchLists').findOne({ _id: ObjectId(user._id) }, { projection: { list: 1, unmatch: 1 }});
            // query gender
            let ugp = user.userInfo.genderpref;
            let gp = [];
            let query = {};

            // TODO: manual query

            // custom query
            for (let gender in GENDERPREF) {
                if (ugp.indexOf(GENDERPREF[gender]) > -1)
                    gp.push(gender);
            }

            if (gp.length > 0) {
                query['userInfo.gender'] = { $in: gp };
            }

            for (let gender in GENDERPREF) {
                if (user.userInfo.gender === gender) {
                    query['userInfo.genderpref'] = { $regex : GENDERPREF[gender] };
                    break;
                }
            }

            promise.then(data => {
                    if (data) {
                        let { list, unmatch } = data;
                        // if list or unmatch is undefined then set them
                        // to an empty array
                        list = list ? list : [];
                        unmatch = unmatch ? unmatch : [];

                        query._id = { $nin: [ ObjectId(user._id), ...list, ...unmatch ] };
                    } else {
                        query._id = { $nin: [ ObjectId(user._id) ]};
                    }
                    // console.log(query);

                    return db.collection('users').find(query, { projection: { pass: 0 }}).toArray()
                }).then(matches => {
                    // console.log(matches)
                    return res.status(200).send(matches);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        unmatchMatch: (req, res) => {
            let user = req.userData;
            let { match } = req.body;
            // make id for chat
            if (user._id === match) {
                // same id not allowed
                return res.status(401).end();
            }

            // insert to unmatch list
            let promise1 = db.collection('matchLists').updateOne(
                { _id: ObjectId(user._id) },
                { $push: { unmatch: ObjectId(match) } },
                { upsert: true }
            );

            let promise2 = db.collection('matchLists').updateOne(
                { _id: ObjectId(match) },
                { $push: { unmatch: ObjectId(user._id) } },
                { upsert: true }
            );

            Promise.all([promise1, promise2])
                .then(([r1, r2]) => {
                    // console.log(r1);
                    // console.log(r2);
                    return res.status(201).send(match);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).send(err);
                });
        },
    }
};

module.exports = matchApi;