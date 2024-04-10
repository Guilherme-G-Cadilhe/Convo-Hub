const calculadora = require('../../models/calculadora.js');


test('somar 2+2 deve retornar 4', () => {
  expect(calculadora.somar(2, 2)).toBe(4);
})
test('somar 5+100 deve retornar 105', () => {
  expect(calculadora.somar(5, 100)).toBe(105);
})
test('somar "banana"+100 deve retornar "Erro"', () => {
  expect(calculadora.somar('banana', 100)).toBe("Erro");
})