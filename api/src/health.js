const {connectMongo} = require("./db");
const {connectRedis} = require("./redis");

async function checkHealth() {

    const mongo = await connectMongo();
    await mongo.command({ ping: 1 });

    const redis = await connectRedis();
    await redis.ping();

    return { status: "ok" };
}

module.exports = { checkHealth};