import admin from 'firebase-admin';
import { createRequire } from 'module'; // 1. Importa createRequire

// 2. Crea una función 'require' para este módulo ES
const require = createRequire(import.meta.url); 

// 3. Carga tu archivo JSON usando la función 'require'
// !! RECUERDA CAMBIAR 'serviceAccountKey.json' POR EL NOMBRE REAL DE TU ARCHIVO !!
const serviceAccount = require('../serviceAccountKey.json'); 

// 4. Inicializa Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 5. Exporta 'admin' para usarlo en otras partes de tu backend (rutas, controladores, etc.)
// Por ejemplo, puedes exportar servicios específicos:
export const auth = admin.auth();
export const db = admin.firestore();

// O simplemente exportar 'admin' por defecto
export default admin;