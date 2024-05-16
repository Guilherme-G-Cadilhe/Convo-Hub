// - /api/migrations

import migrationRunner from "node-pg-migrate";
import { join } from 'node:path';

export default async function migrations(req, res) {

  const defaultMigrationOptions = {
    dryRun: true, // permite realizar todas as etapas das migrations sem executá-las no banco
    databaseUrl: process.env.DATABASE_URL,
    dir: join(process.cwd(), 'infra', 'migrations'), // diretorio das migrations
    direction: 'up', // direção das migrations ( up ou down )
    verbose: true, // mostra a descrição das migrations
    migrationsTable: 'pgmigrations' // nome da tabela onde serão armazenadas as migrations
  }

  if (req.method === 'GET') {
    console.log("GET")
    const pendingMigrations = await migrationRunner(defaultMigrationOptions)
    return res.status(200).json(pendingMigrations);
  }

  if (req.method === 'POST') {
    console.log("POST")
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false
    })
    if (migratedMigrations.length > 0) return res.status(201).json(migratedMigrations);
    return res.status(200).json(migratedMigrations);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
