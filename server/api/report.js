const { ObjectID } = require('mongodb');
const moment = require('moment');

const reportApi = db => {
    return {
        getAllReports: (req, res) => {
            db.collection('reports').find({}).toArray()
                .then(doc => {
                    return res.status(200).send(doc);
                }).catch(err => {
                    return res.status(500).end();
                });
        },

        postReport: (req, res) => {
            // reported, reportType, title, description
            let user = req.userData._id;

            const { reported, reportType, title, description } = req.body;

            const report = {
                user,
                reported,
                reportType,
                title,
                description,
                status: 'pending',
                date: moment().format('YYYY-MM-DDThh:mm:ss.SSSZ')
            }

            db.collection('reports').insertOne(report)
                .then(response => {
                    return res.status(201).end();
                }).catch(err => {
                    console.log(err)
                    return res.status(500).end();
                });
        },

        patchDismissReport: (req, res) => {
            let { reportID } = req.params;

            db.collection('reports').updateOne(
                    { _id: ObjectID(reportID) },
                    { $set: { status: 'complete' } }
                ).then(doc => {
                    return res.status(200).send(reportID);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).send(err);
                });
        },
    }
};

module.exports = reportApi;