document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const data = parseCSV(text);
      console.log('Datos cargados:', data);
      
      // Guardar los datos en una variable global para entrenamiento posterior.
      window.dataset = data.map(row => row.map(Number)); // Asegúrate de convertir los datos a números si es necesario.
    };
    reader.readAsText(file);
  }
});

function parseCSV(text) {
  const rows = text.trim().split('\n');
  return rows.map(row => row.split(',').map(value => value.trim()));
}

document.getElementById('trainButton').addEventListener('click', function () {
  console.log('Iniciar entrenamiento...');

  if (window.dataset) {
    // Configura el modelo KNN usando TytusJS
    const knn = new KNearestNeighbor();
    const numFeatures = window.dataset[0].length - 1;
    
    // Asume que las últimas columnas son etiquetas (puedes ajustar esto)
    const features = window.dataset.map(row => row.slice(0, numFeatures));
    const labels = window.dataset.map(row => row[numFeatures]);

    knn.inicializar(3, features, labels);
    
    console.log('Modelo KNN entrenado con TytusJS.');
  } else {
    console.error('No hay datos cargados para entrenar.');
  }
});

document.getElementById('predictButton').addEventListener('click', function () {
  console.log('Iniciar predicción...');
  
  if (window.dataset) {
    // Ejemplo de predicción con un nuevo dato
    const testData = [2, 3]; // Cambia esto a los datos de entrada para predecir
    const resultado = knn.predecir(testData);
    console.log('Resultado de la predicción:', resultado);
  } else {
    console.error('No hay un modelo entrenado disponible.');
  }
});
