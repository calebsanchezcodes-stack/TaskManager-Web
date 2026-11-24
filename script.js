const CLAVE = 'taskmanager-web-tareas';
let tareas = [];

const form = document.getElementById('form-tarea');
const campo = document.getElementById('texto-tarea');
const mensajeError = document.getElementById('mensaje-error');
const lista = document.getElementById('lista-tareas');
const resumen = document.getElementById('resumen');
const vacio = document.getElementById('vacio');

form.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const texto = campo.value.trim();

  if (texto === '') {
    mensajeError.textContent = 'Escribe el nombre de la tarea antes de agregarla.';
    mensajeError.hidden = false;
    campo.focus();
    return;
  }

  mensajeError.hidden = true;
  tareas.push({ id: Date.now(), texto: texto, completada: false });
  campo.value = '';
  campo.focus();
  guardar();
  mostrar();
});

function mostrar() {
  lista.innerHTML = '';

  tareas.forEach(function (tarea) {
    const item = document.createElement('li');
    item.className = 'tarea' + (tarea.completada ? ' completada' : '');
    item.dataset.id = tarea.id;

    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.checked = tarea.completada;
    casilla.setAttribute('aria-label', 'Marcar como completada: ' + tarea.texto);

    const texto = document.createElement('span');
    texto.className = 'texto';
    texto.textContent = tarea.texto;

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'btn btn-eliminar';
    boton.textContent = 'Eliminar';
    boton.setAttribute('aria-label', 'Eliminar tarea: ' + tarea.texto);

    item.append(casilla, texto, boton);
    lista.appendChild(item);
  });

  const hechas = tareas.filter(function (t) { return t.completada; }).length;
  const pendientes = tareas.length - hechas;
  resumen.textContent = tareas.length === 0
    ? ''
    : pendientes + ' pendiente(s) y ' + hechas + ' completada(s)';
  vacio.hidden = tareas.length > 0;
}

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(tareas));
  } catch (e) {
    // si el navegador no permite guardar, la app sigue funcionando
  }
}

function cargar() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(datos) ? datos : [];
  } catch (e) {
    return [];
  }
}

mostrar();
