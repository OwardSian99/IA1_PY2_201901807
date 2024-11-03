
let knn;
let chart;
const result = document.getElementById('result');
const modelSelect = document.getElementById('modelSelect');
google.charts.load('current', { packages: ['corechart'] });
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
      titleTextStyle: {
        color: '#333',
        fontSize: 16,
        bold: true
      },
      textStyle: {
        color: '#555',
        fontSize: 12
      },
      gridlines: {
        color: '#000000', // Color de las líneas de la cuadrícula
        count: 10 // Número de líneas de cuadrícula
      }
    },
    vAxis: {
      title: 'Y',
      titleTextStyle: {
        color: '#333',
        fontSize: 16,
        bold: true
      },
      textStyle: {
        color: '#555',
        fontSize: 12
      },
      gridlines: {
        color: '#000000',
        count: 10
      }
    },
    backgroundColor: '#b6ffe2', // Color de fondo del gráfico
    legend: {
      position: 'top',
      textStyle: {
        color: '#444',
        fontSize: 14
      }
    }
  };


document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const data = parseCSV(text);
      console.log('Datos cargados:', data);

      //window.dataset = data.map(row => row.map(Number));
      window.dataset = data;
    };
    reader.readAsText(file);
  }
});

function parseCSV(text, isTree = false) {
  const rows = text.trim().split('\n');
  const headers = rows[0].split(',').map(header => header.trim());
  return rows.slice(1).map(row => {
    const values = row.split(',').map(value => value.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = !isTree ? Number(values[index]) : values[index].replace(/"/g, '');
    });
    return obj;
  });
}

const modelData = () => {
  const data = window.dataset;
  return {
    x: data.map(row => row.x),
    y: data.map(row => row.y),
  }
}

const trendChat = (trendData) => {
  const data = new google.visualization.DataTable();
  data.addColumn('number', 'X');
  data.addColumn('number', 'Y');
  data.addRows(trendData);

  const options = {
    title: 'Tendencia de Datos',
    hAxis: { title: 'X' },
    vAxis: { title: 'Y' },
    legend: 'none',
    trendlines: { 0: { type: 'linear', lineWidth: 3, opacity: 0.9 } }
  };

  const chart = new google.visualization.ScatterChart(document.getElementById('resultsChart'));
  chart.draw(data, options);
}

const patternChart = (ptData) => {
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('number', 'X');
  dataTable.addColumn('number', 'Y');
  dataTable.addRows(ptData);

  const options = {
    title: 'Patron de Datos',
    hAxis: { title: 'X' },
    vAxis: { title: 'Y' },
    legend: 'none'
  };

  const chart = new google.visualization.LineChart(document.getElementById('resultsChart'));
  chart.draw(dataTable, options);
};

const lineal = (action) => {
  const { x, y } = modelData();
  //console.log(x, y, '-> x, y');
  const modelLineal = new LinearRegression(x, y);
  modelLineal.fit(x, y);

  const predict = modelLineal.predict(x);

  if (action === 'train') {
    const resultRL = document.createElement('lineal');

    result.innerHTML = '';
    resultRL.innerHTML = `
            <div class="">
            <h1>Modelo Lineal entrenado</h1>
            </div>
            `;

    result.appendChild(resultRL);
    return;

  } else if (action === 'predict') {

    const dataA = [['X', 'YR', 'PRD']];
    x.forEach((val, index) => {
      dataA.push([val, y[index], predict[index]]);
    });
    const resultRL = document.createElement('lineal');

    result.innerHTML = '';
    resultRL.innerHTML = `
            <div class="">
            <h1>Predicción</h1>
            B: ${predict[0]} M:${predict[1]}
            </div>
            `;

    result.appendChild(resultRL);

    const table = google.visualization.arrayToDataTable(dataA);
    const graph = new google.visualization.ComboChart(document.getElementById('resultsChart'));
    graph.draw(table, options);

  } else if (action === 'tendence') {
    const data = [];

    const pending_point = (y[y.length - 1] - y[0]) / (x[x.length - 1] - x[0]);
    for (let i = 0; i < x.length; i++) {
      data.push([x[i], y[i]]);
    }
    trendChat(data, pending_point);
  } else if (action === 'pattern') {

    const ptData = x.map((xv, index) => [xv, y[index]]);
    google.charts.load('current', { 'packages': ['corechart'] });
    patternChart(ptData);
  }
}

const polinomial = (action, degree = 2) => {
  const { x, y } = modelData();
  const modelPolinomial = new PolynomialRegression();
  modelPolinomial.fit(x, y, degree);
  const predict = modelPolinomial.predict(x);
  if (action === 'train') {
    const resultRL = document.createElement('lineal');

    result.innerHTML = '';
    resultRL.innerHTML = `
            <div class="">
            <h1>Modelo Polinomial entrenado</h1>
            </div>
            `;

    result.appendChild(resultRL);
    return;
  } else if (action === 'predict') {
    const resultMP = document.createElement('polinomial');
    result.innerHTML = '';
    resultMP.innerHTML = `
    <div class="">
    Degree: ${degree} <br>
    Soluciones: ${JSON.stringify(modelPolinomial.solutions.join(', '))}
    Error: ${modelPolinomial.error}
    </div>`;
    result.appendChild(resultMP);
    const dataA = [['X', 'YR', 'PRD']];
    x.forEach((val, index) => {
      dataA.push([val, y[index], predict[index]]);
    });
    const table = google.visualization.arrayToDataTable(dataA);
    const graph = new google.visualization.ComboChart(document.getElementById('resultsChart'));
    graph.draw(table, options);
  }else if (action === 'tendence') {
    const data = [];
    const pending_point = (y[y.length - 1] - y[0]) / (x[x.length - 1] - x[0]);
    for (let i = 0; i < x.length; i++) {
      data.push([x[i], y[i]]);
    }
    trendChat(data, pending_point);

  }else if (action === 'pattern') {
    const ptData = x.map((xv, index) => [xv, y[index]]);
    google.charts.load('current', { 'packages': ['corechart'] });
    patternChart(ptData);
  }
}

document.getElementById('trainButton').addEventListener('click', function () {
  console.log('Iniciar entrenamiento...');

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

document.getElementById('predictButton').addEventListener('click', function () {
  console.log('Iniciar predicción...');
  const model = modelSelect.value;
  switch (model) {
    case 'lineal':
      lineal('predict');
      break;
    case 'polinomial':
      const { grado = 2 } = document.getElementById('parametro').value;
      polinomial('predict', grado);
      break;
    default:
      console.error('Modelo no soportado.');
  }

});


document.getElementById('tendenceButton').addEventListener('click', function () {
  console.log('Iniciar tendencia...');
  const model = modelSelect.value;
  switch (model) {
    case 'lineal':
      lineal('tendence');
      break;
    case 'polinomial':
      const { grado = 2 } = document.getElementById('parametro').value;
      polinomial('tendence', grado);
      break;
    default:
      console.error('Modelo no soportado.');
  }

});


document.getElementById('patternButton').addEventListener('click', function () {
  console.log('Iniciar patron...');
  const model = modelSelect.value;
  switch (model) {
    case 'lineal':
      lineal('pattern');
      break;
    case 'polinomial':
      const { grado = 2 } = document.getElementById('parametro').value;
      polinomial('pattern', grado);
      break;
    default:
      console.error('Modelo no soportado.');
  }

});
