const {MongoClient} = require('mongodb');
const fs = require('fs');

let client;
let db;

function requiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value;
}

function requiredSecretFromFile(envName) {
    const filePath = requiredEnv(envName);
  
    // Why: Docker secrets files almost always end with a newline; trim prevents auth failures.
    const value = fs.readFileSync(filePath, "utf8").trim();
  
    if (!value) throw new Error(`Secret file is empty for env: ${envName}`);
    return value;
  }

async function connectMongo() {
    if (db) return db;

    const host = requiredEnv('MONGO_HOST');
    const port = requiredEnv('MONGO_PORT');
    const database = requiredEnv('MONGO_DB');

    const user = requiredSecretFromFile('MONGO_USER_FILE');
    const pass = requiredSecretFromFile('MONGO_PASS_FILE');

    const uri =
    `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}` +
    `@${host}:${port}/${database}?authSource=admin`;

    client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000
    });

    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(database);
    return db;

}

async function closeMongo() {

    if (client) {
        await client.close();
        client = undefined;
        db = undefined;
    }
}

module.exports = {
    connectMongo,
    closeMongo
};
