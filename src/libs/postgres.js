import { Client } from "pg";

async function getConnection() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "andres",
    password: "secret",
    database: "my_store",
  });
  await client.connect();
  return client;
}

export default getConnection();
