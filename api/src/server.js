const express = require('express');
const {connectMongo, closeMongo} = require("./db");
const {connectRedis, closeRedis} = require("./redis");
const {checkHealth} = require("./health");

const app = express();
app.use(express.json());

app.get('/health', async (request, response) => {

    try {
        const result = await checkHealth();
        response.status(200).json(result);
    }
    catch (error) {
        response.status(503).json({ok: false, error: error.message});
    }
});

app.get("/api/items", async(request, response) => {
    try {
        const redis = await connectRedis();

        const cached = await redis.get("items:v1");
        if (cached) return res.json({ source: "cache", items: JSON.parse(cached) });

        const db = await connectMongo();
        const items = await db.collection("items").find({}).sort({ createdAt: -1 }).limit(50).toArray();

        await redis.setEx("items:v1", 30, JSON.stringify(items));
        response.json({ source: "db", items });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.post("/api/items", async(request, response) =>{
    try {
        const {name} = request.body;
        if (!name || typeof name !== "string") {
            return response.status(400).json({ error: "name is required" });
        }

        const db = await connectMongo();
        const doc = {name, createdAt: new Date()};
        const result = await db.collection("items").insertOne(doc);

        const redis = await connectRedis();
        await redis.del("items:v1");

        response.status(201).json({ id: result.insertedId, ...doc });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

const port = Number(process.env.PORT || 3000);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function shutdown(signal) {
    console.log(`Received ${signal}; shutting down`);
    server.close(async () => {
      try {
        await closeRedis();
        await closeMongo();
      } catch (e) {
        console.error("Shutdown error:", e);
      } finally {
        process.exit(0);
      }
    });
  }

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
