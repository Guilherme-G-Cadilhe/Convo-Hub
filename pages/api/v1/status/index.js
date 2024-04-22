// - /api/status

import database from '/infra/database.js'

async function status(req, res) {
  const databaseName = process.env.POSTGRES_DB
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query('SHOW server_version;');
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionResult = await database.query('SHOW max_connections;');
  const databaseMaxConnectionValue = databaseMaxConnectionResult.rows[0].max_connections;

  const databaseOpenConnectionsResult = await database.query({
    text: `SELECT count(*)::int AS opened_connections FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName]
  },)
  // const databaseOpenConnectionsResult = await database.query('SELECT count(*)::int AS opened_connections FROM pg_stat_activity WHERE datname = current_database();')
  const currentConnections = databaseOpenConnectionsResult.rows[0].opened_connections

  // console.log('currentConnections', currentConnections)

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionValue),
        opened_connections: currentConnections
      }
    }
  });
};

export default status