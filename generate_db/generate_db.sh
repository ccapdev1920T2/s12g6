mongoimport -d Anispark -c admins --jsonArray < admins.json
mongoimport -d Anispark -c users --jsonArray < users.json
mongoimport -d Anispark -c chats --jsonArray < chats.json
mongoimport -d Anispark -c matchLists --jsonArray < matchLists.json

mongo Anispark --eval "db.verify.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })"
mongo Anispark --eval "db.deleted.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 })"