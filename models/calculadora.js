function somar(numero1, numero2) {
  if (typeof numero1 !== 'number' || typeof numero2 !== 'number') {
    return 'Erro'
  }
  return numero1 + numero2
}
function subtrair(numero1, numero2) { return numero1 - numero2; }
function multiplicar(numero1, numero2) { return numero1 * numero2; }
function dividir(numero1, numero2) { return numero1 / numero2; }

exports.somar = somar;
exports.subtrair = subtrair;
exports.multiplicar = multiplicar;
exports.dividir = dividir;