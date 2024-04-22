test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log('responseBody', responseBody)
  expect(responseBody.updated_at).toBeDefined();
  // confirma que é um valor de tempo válido 
  expect(responseBody.updated_at).toEqual(new Date(responseBody.updated_at).toISOString())
  expect(responseBody.dependencies.database.version).toEqual("16.2")
  expect(responseBody.dependencies.database.max_connections).toEqual(100)
  expect(responseBody.dependencies.database.opened_connections).toEqual(1)

});

// test.only("Teste de SQL Injection", async () => {
//   await fetch("http://localhost:3000/api/v1/status?databaseName=; SELECT pg_sleep(10); --");
// });