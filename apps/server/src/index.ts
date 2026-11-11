import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";

async function start() {
  const config = loadConfig();
  const app = await buildApp(config);
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
  } catch (err) {
    app.log.fatal(err);
    process.exit(1);
  }
}

start();
