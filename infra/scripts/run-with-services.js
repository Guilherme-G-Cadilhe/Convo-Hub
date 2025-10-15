// run-with-services.js
const { spawn } = require("child_process");

// Utilitário para cores no terminal
const color = {
  green: (msg) => `\x1b[32m${msg}\x1b[0m`,
  yellow: (msg) => `\x1b[33m${msg}\x1b[0m`,
  red: (msg) => `\x1b[31m${msg}\x1b[0m`,
  cyan: (msg) => `\x1b[36m${msg}\x1b[0m`,
  gray: (msg) => `\x1b[90m${msg}\x1b[0m`,
};

// Executa um comando com herança de stdio
async function exec(command, args = []) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: "inherit", shell: true });
    proc.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function run() {
  const args = process.argv.slice(2); // Exemplo: ["next", "dev"]
  if (args.length === 0) {
    console.error(color.red("❌ Nenhum comando informado."));
    console.log(
      color.gray("Exemplo: node infra/scripts/run-with-services.js next dev"),
    );
    process.exit(1);
  }

  console.log(color.cyan("🔧 Iniciando ambiente de desenvolvimento...\n"));

  try {
    console.log(color.yellow("🚀 Subindo containers..."));
    await exec("npm", ["run", "services:up"]);
    console.log(color.green("✅ Containers prontos!\n"));

    console.log(color.yellow("⏳ Aguardando banco de dados..."));
    await exec("npm", ["run", "services:wait:database"]);
    console.log(color.green("✅ Banco disponível!\n"));

    console.log(color.yellow("📦 Executando migrações..."));
    await exec("npm", ["run", "migrations:up"]);
    console.log(color.green("✅ Migrações concluídas!\n"));

    console.log(color.cyan("▶️ Iniciando comando principal...\n"));
    const main = spawn(args[0], args.slice(1), {
      stdio: "inherit",
      shell: true,
    });
    let cleanedUp = false;
    const cleanup = async (signal) => {
      if (cleanedUp) return;
      cleanedUp = true;
      console.log(
        color.yellow(
          `\n🧹 Encerrando containers... ${signal ? `(Sinal: ${signal})` : ""}`,
        ),
      );
      try {
        await exec("npm", ["run", "services:stop"]);
        console.log(color.green("✅ Containers encerrados com sucesso."));
      } catch {
        console.log(color.red("⚠️ Falha ao encerrar containers."));
      }
      process.exit();
    };

    // Captura Ctrl+C ou kill
    process.on("SIGINT", () => cleanup("SIGINT"));
    process.on("SIGTERM", () => cleanup("SIGTERM"));
    main.on("exit", () => cleanup("child_exit"));
  } catch (err) {
    console.error(color.red(`\n💥 Erro: ${err.message}`));
    console.log(color.yellow("Tentando encerrar containers..."));
    await exec("npm", ["run", "services:stop"]).catch(() => {});
    process.exit(1);
  }
}

run();
