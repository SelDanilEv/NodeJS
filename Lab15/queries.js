const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

let DBPass = 'dbUserPassword';
config =
    {"db": {"connectionString": `mongodb+srv://dbUser:${DBPass}@cluster0.qb3iu.mongodb.net/test?retryWrites=true&w=majority`}};

let client;

class DB {
    constructor() {
        client = new MongoClient(config.db.connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
        client = client.connect().then(this.getConnection);
        console.log("Connected to MongoDB");
    }

    getConnection(connection) {
        return connection.db("Test");
    }

    GetTable(tableName) {
        return client.then(db => {
            return db.collection(tableName).find({}).toArray();
        });
    }

    InsertField(tableName, fields) {
        return client
            .then(async db => {
                await db.collection(tableName).insertOne(fields);
            });
    }

    UpdateField(tableName, id, fields) {
        return client
            .then(async db => {
                if (!id) {
                    throw "Wrong ID";
                }
                await db.collection(tableName).updateOne({_id: ObjectId(id)}, {$set: fields});
                return '';
            })
    }

    DeleteField(tableName, id) {
        return client
            .then(async db => {
                if (!id) {
                    throw 'Wrong ID';
                }
                await db.collection(tableName).deleteOne({_id: ObjectId(id)});
                return '';
            });
    }
}

module.exports = DB;
