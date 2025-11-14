/**
 * Genera un token aleatorio y seguro usando la API Crypto del navegador.
 * @param {number} longitudBytes - El número de bytes aleatorios a generar. La longitud del string final será el doble.
 * @returns {string} Un string hexadecimal aleatorio.
 */
function generarTokenSeguro(longitudBytes = 32) {
  // 1. Creamos un array de bytes vacío
  const array = new Uint8Array(longitudBytes);
  
  window.crypto.getRandomValues(array);
  
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

const miToken = generarTokenSeguro(32);
console.log(miToken);

const rutaSegura = `/restablecer-password/${miToken}`;
console.log(rutaSegura);