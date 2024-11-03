# Manual Técnico
## Oward Sian - 201901807

### Objetivo
Practicar los conceptos de Machine Learning mediante el uso de la biblioteca tytus.js creando
un sitio Web con Pages de GitHub, JavaScript y HTML.

### Herramientas utilizadas

- Tytus: Es un proyecto de código abierto desarrollado por estudiantes y catedráticos de la USAC La librería TytusJS, en particular, es parte de una serie de herramientas de Tytus y se enfoca en el uso de tecnologías web para la implementación de funciones de bases de datos, utilizando JavaScript. Es conocida por su aplicación educativa en cursos de bases de datos y sistemas de información, permitiendo a los estudiantes interactuar con la teoría y la práctica del manejo de datos de manera interactiva.

- Javascript: Ees un lenguaje de programación interpretado y de alto nivel que se utiliza principalmente en el desarrollo web. Es ampliamente conocido por permitir la creación de páginas web interactivas y dinámicas. Se ejecuta en el navegador del usuario y permite agregar funcionalidades como animaciones, validación de formularios, manipulación del DOM (Document Object Model) y más.

- HTML: HTML es el lenguaje de marcado estándar para crear y estructurar el contenido de las páginas web. Define la estructura básica de una página web mediante elementos como encabezados, párrafos, listas, enlaces, imágenes y más.

- CORECHART: Es una biblioteca de JavaScript que permite la creación de gráficos interactivos y personalizables para sitios web. Ofrece una variedad de tipos de gráficos como gráficos de líneas, barras, circulares, de dispersión, etc. CoreChart es ideal para visualizar datos de manera clara y efectiva y es muy útil para la representación gráfica de datos en proyectos web.


### Inicialización

```javascript
let chart;
const result = document.getElementById('result');
const modelSelect = document.getElementById('modelSelect');
google.charts.load('current', { packages: ['corechart'] });
```
chart: Variable reservada para almacenar el gráfico.
result: Elemento del DOM donde se mostrarán los resultados.
modelSelect: Elemento del DOM que permite seleccionar el tipo de modelo de regresión.

### Crear base de gráfico
```javascript
const options = {
    title: 'Predicción',
    seriesType: 'scatter',
    series: {
        0: {
            type: 'scatter',
            pointShape: 'triangle',
            pointSize: 7,
            color: '#fd0606'
        },
        1: {
            type: 'line',
            color: '#33ff42',
            lineWidth: 3
        }
    },
    hAxis: {
        title: 'X',
        titleTextStyle: { color: '#333', fontSize: 16, bold: true },
        textStyle: { color: '#555', fontSize: 12 },
        gridlines: { color: '#000000', count: 10 }
    },
    vAxis: {
        title: 'Y',
        titleTextStyle: { color: '#333', fontSize: 16, bold: true },
        textStyle: { color: '#555', fontSize: 12 },
        gridlines: { color: '#000000', count: 10 }
    },
    backgroundColor: '#b6ffe2',
    legend: {
        position: 'top',
        textStyle: { color: '#444', fontSize: 14 }
    }
};

```
### Carga de los datos
```javascript
document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const data = parseCSV(text);
      console.log('Datos cargados:', data);
      window.dataset = data;
    };
    reader.readAsText(file);
  }
});
```
- Escucha los cambios en el input del archivo y carga el contenido del archivo CSV.
- Utiliza la función parseCSV para procesar los datos.
### Parseo del CSV
```javascript
function parseCSV(text, isTree = false) {
  const rows = text.trim().split('\n');
  const headers = rows[0].split(',').map(header => header.trim());
  return rows.slice(1).map(row => {
    ...
  });
}
```
### Manejo y modelado de los datos
```javascript
const modelData = () => {
    const data = window.dataset;
    return {
        x: data.map(row => row.x),
        y: data.map(row => row.y),
    }
}

```
- Extrae los valores x e y del conjunto de datos cargado.

### Predicción y entrenamiento de datos
```javascript
const lineal = (action) => {
    const { x, y } = modelData();
    const modelLineal = new LinearRegression(x, y);
    modelLineal.fit(x, y);
    const predict = modelLineal.predict(x);
    // Lógica para mostrar resultados y graficar
}

```
- Extrae los valores x e y del conjunto de datos cargado.

### Manejo de botones
```javascript
//  Ejemplo
document.getElementById('trainButton').addEventListener('click', function () {
    const model = modelSelect.value;
    switch (model) {
        case 'lineal':
            lineal('train');
            break;
        case 'polinomial':
            const { grado = 2 } = document.getElementById('parametro').value;
            polinomial('train', grado);
            break;
        default:
            console.error('Modelo no soportado.');
    }
});

```

- Escucha los clics en los botones de la interfaz para entrenar, predecir, y calcular tendencias utilizando los modelos seleccionados.