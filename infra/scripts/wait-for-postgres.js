const { exec } = require("node:child_process"); // Permite executar comandos externos

function checkPostgres() {
  // Verifica se o postgres esta pronto e troca a porta para tcp ip
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    // resultado do standard output (saída padrão)
    // Verifica se string contém "accepting connections"
    if (stdout.search("accepting connections") !== -1) {
      console.log("\n[Postgres is ready!]\n");
      return;
    }
    process.stdout.write(".");
    setTimeout(checkPostgres, 1000);
  }
}

process.stdout.write("\n\n[Waiting for postgres]:");
checkPostgres();
