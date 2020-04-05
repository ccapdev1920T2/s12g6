const { ObjectId } = require('mongodb');
const moment = require('moment');
const fsp = require('fs').promises;
const fse = require('fs-extra');

const chatApi = db => {
    return {
        getInit: (req, res) => {
            const user = req.userData;

            db.collection('matchLists').findOne({ _id: ObjectId(user._id) })
                .then(list => {
                    // check if there is a list => prompt user to find a match
                    // check the length of the list if 0 => same prompt
                    if (list && list.list)
                        list = list.list;
                    else {
                        // console.log(user);
                        // res.status(200).send(user);
                        return [];
                    }

                    let queryList = [];
                    let id;
                    
                    // get the list of message of both
                    for (let i = 0; i < list.length; i++) {
                        id = list[i].toString();
                        if (user._id < id) {
                            queryList.push(`${user._id}-${id}`);
                        } else {
                            queryList.push(`${id}-${user._id}`);
                        }
                    }

                    return db.collection('chats').find({ _id: { $in: queryList } }).toArray();
                }).then(chats => {
                    return res.status(200).send({ chats, user });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        getAllChats: (req, res) => {
            db.collection('chats').find({}, { projection: { _id: 1, u1: 1, u2: 1 } }).toArray()
                .then(doc => {
                    return res.status(200).send(doc);
                }).catch(err => {
                    return res.status(500).end();
                })
        },

        createChat: (req, res) => {
            let user = req.userData;
            let { match, txt } = req.body;
            // make id for chat
            // same id not allowed
            if (user._id === match._id)
                return res.status(401).send('Same ID Error');

            // insert to each one's lists
            let promise1 = db.collection('matchLists').updateOne(
                { _id: ObjectId(user._id) },
                { $push: { list: ObjectId(match._id) } },
                { upsert: true }
            );
            
            let promise2 = db.collection('matchLists').updateOne(
                { _id: ObjectId(match._id) },
                { $push: { list: ObjectId(user._id) } },
                { upsert: true }
            );

            const time = moment().format('YYYY-MM-DDThh:mm:ss.SSSZ');

            // create chat
            let chat = {};
            chat.lastMsgSentDate = time;
            chat.read = false;

            if (user._id < match._id) {
                chat._id = `${user._id}-${match._id}`;
                chat.u1 = user.userInfo.nickname;
                chat.u2 = match.userInfo.nickname;
                chat.u1img = user.dp;
                chat.u2img = match.dp;
                chat.messages = [ { txt, time, user: 'u1' } ];
                chat.lastUser = 'u1';
            } else {
                chat._id = `${match._id}-${user._id}`;
                chat.u1 = match.userInfo.nickname;
                chat.u2 = user.userInfo.nickname;
                chat.u1img = match.dp;
                chat.u2img = user.dp;
                chat.messages = [ { txt, time, user: 'u2' } ];
                chat.lastUser = 'u2';
            }

            let promise3 = db.collection('chats').insertOne(chat)

            const folderPath = `./images/chats/${chat._id}`;
            fsp.access(folderPath).catch(() => {
                    return fsp.mkdir(folderPath);
                }).then(() => {
                    let promise4 = fsp.copyFile(
                        `./images/users/${user._id}/${user.dp}`,
                        `${folderPath}/${user.dp}`
                    );

                    let promise5 = fsp.copyFile(
                        `./images/users/${match._id}/${match.dp}`,
                        `${folderPath}/${match.dp}`
                    );

                    return Promise.all([promise1, promise2, promise3, promise4, promise5])
                }).then(([r1, r2, r3, r4, r5]) => {
                    // console.log('p1', r1);
                    // console.log('p2', r2);
                    // console.log('p3', r3);
                    return res.status(201).send({
                        newChat: chat, 
                        matchID: match._id,
                        userID: user._id
                    });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        postMessage: (req, res) => {
            let { txt } = req.body;
            let { chatID } = req.params;
            let user = req.userSender; // u1 or u2

            let time = moment().format('YYYY-MM-DDThh:mm:ss.SSSZ');
            let msg = { txt, user, time };

            db.collection('chats').updateOne(
                    { _id: chatID },
                    {
                        $push: { messages: msg },
                        $set: { 
                            lastMsgSentDate: time,
                            lastUser: user,
                            read: false
                        }
                    }
                ).then(doc => {
                    if (doc.result.nModified == 1) {
                        return res.status(200).send({
                            chatID,
                            msg
                        });
                    }
                    return res.status(500).end();
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        postImage: (req, res) => {
            let { filename } = req.file;
            let { chatID } = req.params;
            let user = req.userSender;

            let time = moment().format('YYYY-MM-DDThh:mm:ss.SSSZ');
            let msg = { img: filename, user, time };

            db.collection('chats').updateOne(
                    { _id: chatID },
                    {
                        $push: { messages: msg },
                        $set: { 
                            lastMsgSentDate: time,
                            lastUser: user
                        }
                    }
                ).then(doc => {
                    if (doc.result.nModified == 1) {
                        return res.status(200).send({
                            chatID,
                            msg
                        });
                    }
                    return res.status(500).end();
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                });
        },

        patchReadChat: (req, res) => {
            let { chatID } = req.params;

            db.collection('chats').updateOne(
                    { _id: chatID },
                    { $set: { read: true } }
                ).then(response => {
                    return res.status(200).send(chatID);
                }).catch(err => {
                    console.log(err)
                    return res.status(500).end();
                });
        },

        deleteChat: (req, res) => {
            let { chatID } = req.params;

            let userID = req.userData._id;
            let matchID;
            let { userSender } = req;

            if (userSender === 'u1')
                matchID = chatID.substring(25);
            else // u2
                matchID = chatID.substring(0, 24);
            
            // delete chat, remove from match list and put user's match to unmatch and the other to unmatchUnnotified delete chat files
            let promise1 = db.collection('chats').deleteOne({ _id: chatID });

            userID = ObjectId(userID)
            matchID = ObjectId(matchID)

            let promise2 = db.collection('matchLists').updateOne(
                { _id: userID },
                { 
                    $pull: { list: matchID },
                    $push: { unmatch: matchID }
                }
            );
            
            let promise3 = db.collection('matchLists').updateOne(
                { _id: matchID },
                {
                    $pull: { list: userID },
                    $push: { unmatchUnnotified: userID }
                }
            );

            let promise4 = fse.move(`./images/chats/${chatID}`, `./images/deleted/chats/${chatID}`);

            Promise.all([promise1, promise2, promise3, promise4])
                .then(([r1, r2, r3, r4]) => {
                    return res.status(200).send(chatID);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).end();
                })
        },
    };
}

module.exports = chatApi;