const { createClient } = require("redis");
const fs = require("fs");

let redis;

function requiredEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

function requiredSecretFromFile(envName) {
  const filePath = requiredEnv(envName);

  // Why: trimming avoids subtle auth failures caused by trailing newline.
  const value = fs.readFileSync(filePath, "utf8").trim();

  if (!value) throw new Error(`Secret file is empty for env: ${envName}`);
  return value;
}

async function connectRedis() {
  if (redis) return redis;

  const host = requiredEnv("REDIS_HOST");
  const port = requiredEnv("REDIS_PORT");

  // Reads secrets via *_FILE env var (path).
  const password = requiredSecretFromFile("REDIS_PASS_FILE");

  redis = createClient({
    url: `redis://:${encodeURIComponent(password)}@${host}:${port}`
  });

  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });

  await redis.connect();
  console.log("Connected to Redis");
  return redis;
}

async function closeRedis() {
  if (redis) await redis.quit();
  redis = undefined;
}

module.exports = { connectRedis, closeRedis };