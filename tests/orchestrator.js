import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();
  const AWS_SECRET = "AKIA1234567890ABCDEF"

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw new Error("Status not ready");
      }
    }
  }
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
