import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
  hostname: "db",
  username: "root",
  db: "deno-dev",
  password: "Passw0rd",
});

export default client;