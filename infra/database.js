import { Client } from 'pg';

async function query(queryString) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  })
  try {
    await client.connect()

    const result = await client.query(queryString)
    return result

  } catch (err) {
    console.error(err);
  } finally {
    await client.end()
  }
}

export default {
  query
}