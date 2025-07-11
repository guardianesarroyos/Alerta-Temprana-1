    // ===== CÓDIGO METEOROLÓGICO ACTUALIZADO =====
    const stationId = "IINGEN39";
    const apiKeyWunderground = window.WUNDERGROUND_API_KEY;
    const updateInterval = 10 * 60 * 1000; // 5 minutos

    // Elementos DOM
    const rainValueElement = document.getElementById('rain-value');
    const rainTimeElement = document.getElementById('rain-time');
    const tempValueElement = document.getElementById('temp-value');
    const tempTimeElement = document.getElementById('temp-time');

    function actualizarDatosWunderground() {
      const url = `https://api.weather.com/v2/pws/observations/current?stationId=${stationId}&format=json&units=m&apiKey=${apiKeyWunderground}`;
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.observations?.length > 0) {
            const obs = data.observations[0];
            const updateTime = new Date(obs.obsTimeLocal);
            const timeString = updateTime.toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'});
            
            // Actualizar lluvia
            const rain = obs.metric.precipTotal;
            rainValueElement.textContent = `${rain?.toFixed(1) || '--'} mm`;
            rainTimeElement.textContent = `Actualizado ${timeString}`;
            
            // Actualizar temperatura
            const temp = obs.metric.temp;
            tempValueElement.textContent = `${temp?.toFixed(1) || '--'} °C`;
            tempTimeElement.textContent = `Wunderground (CCMB50) ${timeString}`;
          }
        })
        .catch(error => {
          console.error("Error al obtener datos:", error);
          rainTimeElement.textContent = "Error de conexión";
          tempTimeElement.textContent = "Error de conexión";
        });
    }

    // Actualizar inmediatamente y cada 5 minutos
    actualizarDatosWunderground();
    setInterval(actualizarDatosWunderground, updateInterval);

    // ===== CÓDIGO DE ALERTA TEMPRANA =====
    // Elementos principales
    const rain = document.getElementById("rain");
    const rainValue = document.getElementById("rainValue");
    const alturaDisplay = document.getElementById("altura");
    const impactoDisplay = document.getElementById("impacto");
    const scenario = document.getElementById("scenario");
    const sudestada = document.getElementById("sudestada");
    const aguasArriba = document.getElementById("aguasArriba");
    const sueloSaturado = document.getElementById("sueloSaturado");
    const levelFill = document.getElementById("levelFill");
    const marks = document.getElementById("marks");

    // Elementos "Mi Casa"
    const miCasaInput = document.getElementById("miCasaInput");
    const miCasaButton = document.getElementById("miCasaButton");

    // Contenedor de la barra y referencias de "Mi Casa"
    const levelBar = document.querySelector(".level-bar");
    let miCasaLine = null;
    let miCasaLabel = null;

    // Tabla de conversión lluvia → altura (según escenario)
    const tabla = {
      0: [1.3, 1.16, 1.05],
      10: [1.4, 1.25, 1.13],
      20: [1.6, 1.42, 1.3],
      30: [1.9, 1.69, 1.54],
      40: [2.2, 1.96, 1.78],
      50: [2.6, 2.31, 2.11],
      60: [2.8, 2.49, 2.27],
      70: [3.0, 2.67, 2.43],
      80: [3.2, 2.85, 2.59],
      90: [3.33, 2.96, 2.7],
      100: [3.47, 3.09, 2.81],
      110: [3.6, 3.2, 2.92],
      120: [3.77, 3.36, 3.06],
      130: [3.93, 3.5, 3.18],
      140: [4.1, 3.65, 3.32],
      150: [4.23, 3.76, 3.43],
      160: [4.37, 3.89, 3.54],
      170: [4.5, 4.01, 3.65],
      180: [4.6, 4.09, 3.73],
      190: [4.7, 4.18, 3.81],
      200: [4.8, 4.27, 3.89],
      210: [4.92, 4.38, 3.99],
      220: [5.04, 4.49, 4.08],
      230: [5.15, 4.58, 4.17],
      240: [5.25, 4.67, 4.25],
      250: [5.35, 4.76, 4.33],
      260: [5.44, 4.84, 4.41],
      270: [5.53, 4.92, 4.48],
      280: [5.62, 5.00, 4.55],
      290: [5.71, 5.08, 4.63],
      300: [5.8, 5.16, 4.70]
    };

    function obtenerAlturaDeTabla(mm) {
      // redondeo a múltiplos de 10
      const clave = Math.min(300, Math.floor(mm / 10) * 10);
      return tabla[clave];
    }

    function updateValues() {
      const mm = parseInt(rain.value);
      let mmEfectivos = mm;
      if (sueloSaturado.checked) mmEfectivos = Math.min(mm * 2, 300);

      const fila = obtenerAlturaDeTabla(mmEfectivos);
      const idx = { "24": 0, "48": 1, "72": 2 }[scenario.value];
      let altura = fila[idx];

      if (sudestada.checked) altura += 0.2;
      if (aguasArriba.checked) altura += 0.2;

      altura = Math.min(altura, 5.8);
      alturaDisplay.textContent = altura.toFixed(2);

      let impacto = "Sin impacto";
      if (altura >= 3.6 && altura < 4.1) impacto = "Desborde a terrenos bajos y calles";
      else if (altura >= 4.1 && altura < 4.5) impacto = "Ingreso en casas bajas";
      else if (altura >= 4.5 && altura < 4.8) impacto = "Ingreso en casas medias";
      else if (altura >= 4.8 && altura < 5.0) impacto = "Ingreso en casas altas";
      else if (altura >= 5.0) impacto = "Corte de ruta, inundación severa";

      impactoDisplay.textContent = impacto;

      const porcentaje = (altura / 5.8) * 100;
      levelFill.style.height = porcentaje + "%";

      // Actualizar línea de "Mi Casa" si existe
      if (miCasaLine) {
        const valorCasa = parseFloat(miCasaInput.value);
        if (!isNaN(valorCasa)) {
          const pctCasa = (valorCasa / 5.8) * 100;
          miCasaLine.style.bottom = pctCasa + "%";
          miCasaLabel.style.bottom = pctCasa + "%";
        }
      }
    }

    // Generar ticks (cada 0.20 m)
    for (let i = 5.8; i >= 0; i -= 0.20) {
      const mark = document.createElement("div");
      mark.classList.add("mark");
      mark.textContent = i.toFixed(2);
      marks.appendChild(mark);
    }

    // Frases ambientales
    const frasesAmbientales = [
      "No es el clima, es la desidia.",
      "El arroyo limpio es vida para todos, no lujo para pocos.",
      "No es la lluvia, es la falta de obras.",
      "Agua sana, barrio digno.",
      "No es el cambio climático, es el abandono a los vecinos.",
      "El arroyo es de todos: cuidémoslo, no demos la espalda.",
      "No culpes al cielo: exigí obras en la tierra.",
      "Sin basura, sin cloacas, con vida: así queremos el arroyo.",
      "No nos inunda el clima, nos inunda la inacción.",
      "Saneamiento es respeto: por la naturaleza y por los vecinos.",
      "No es un desastre natural, es un desastre político.",
      "Por un arroyo con peces, con árboles saludables y sin contaminación.",
      "El agua cae del cielo, pero los daños vienen de abajo.",
      "Queremos un arroyo que fluya, no que enferme.",
      "No es la naturaleza, es la falta de infraestructura.",
      "El arroyo no es fondo de patio, es patrimonio vecinal.",
      "No es el cambio climático, es la falta de obras.",
      "El agua limpia no distingue barrios: defendámosla juntos."
    ];

    function mostrarFraseDelDia() {
      const hoy = new Date();
      const inicio = new Date(2023, 0, 1);
      const diff = hoy - inicio;
      const unDia = 1000 * 60 * 60 * 24;
      const diasTranscurridos = Math.floor(diff / unDia);
      const indice = diasTranscurridos % frasesAmbientales.length;
      document.getElementById('fraseAmbiental').textContent = frasesAmbientales[indice];
    }

    // Botón "+ Mi Casa"
    miCasaButton.addEventListener("click", () => {
      const valor = parseFloat(miCasaInput.value);
      if (isNaN(valor) || valor < 0) {
        alert("Ingresá un valor numérico válido para la altura de tu casa.");
        return;
      }
      // Si ya existe, no crear de nuevo
      if (!miCasaLine) {
        miCasaLine = document.createElement("div");
        miCasaLine.classList.add("mi-casa-line");
        levelBar.appendChild(miCasaLine);

        miCasaLabel = document.createElement("div");
        miCasaLabel.classList.add("mi-casa-label");
        miCasaLabel.textContent = `Mi Casa (${valor.toFixed(2)} m)`;
        levelBar.appendChild(miCasaLabel);
      }
      // Ajustar posición inicial
      const pctCasa = (valor / 5.8) * 100;
      miCasaLine.style.bottom = pctCasa + "%";
      miCasaLabel.style.bottom = pctCasa + "%";

      // Actualizar texto de etiqueta en cada cambio de valor
      miCasaInput.addEventListener("input", () => {
        const nuevo = parseFloat(miCasaInput.value);
        if (!isNaN(nuevo)) {
          const pctN = (nuevo / 5.8) * 100;
          miCasaLine.style.bottom = pctN + "%";
          miCasaLabel.style.bottom = pctN + "%";
          miCasaLabel.textContent = `Mi Casa (${nuevo.toFixed(2)} m)`;
        }
      });
    });

    // Listeners principales
    rain.addEventListener("input", () => {
      rainValue.textContent = rain.value;
      updateValues();
    });
    scenario.addEventListener("change", updateValues);
    sudestada.addEventListener("change", updateValues);
    aguasArriba.addEventListener("change", updateValues);
    sueloSaturado.addEventListener("change", updateValues);

    // Inicialización
    updateValues();
    mostrarFraseDelDia();    