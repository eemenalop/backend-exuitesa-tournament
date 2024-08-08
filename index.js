const { getAllTablesData } = require('./database');

async function run() {
  try {
    const allData = await getAllTablesData();
    console.log('Datos de la base de datos:', allData);
  } catch (error) {
    console.error('Error al ejecutar la aplicación:', error);
  }
}

run();
