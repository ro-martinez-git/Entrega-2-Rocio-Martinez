const inputPacienteNombre = document.getElementById('nombrePaciente');
const botonAgregarPaciente = document.getElementById('btnAgregarPaciente');
const selectorPacientes = document.getElementById('selectPaciente');
const inputServicioNombre = document.getElementById('nombreServicio');
const inputServicioPrecio = document.getElementById('precioServicio');
const botonAgregarServicio = document.getElementById('btnAgregarServicio');
const contenedorServicios = document.getElementById('servicios-list');
const textoTotal = document.getElementById('totalServicio');
const botonFinalizarCompra = document.getElementById('btnTerminarCompra');

const listaPacientes = [];

class Paciente {
  constructor(nombre) {
    this.nombre = nombre;
    this.serviciosContratados = [];
  }

  agregarServicio(servicio) {
    this.serviciosContratados.push(servicio);
  }

  calcularTotalServicios() {
    return this.serviciosContratados.reduce(
      (suma, servicio) => suma + servicio.precio,
      0
    );
  }

  limpiarServicios() {
    this.serviciosContratados = [];
  }
}

class Servicio {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }
}

function guardarPacientesEnLocalStorage() {
  localStorage.setItem('pacientes', JSON.stringify(listaPacientes));
}

function cargarPacientesDesdeLocalStorage() {
  const pacientesGuardados = localStorage.getItem('pacientes');
  if (pacientesGuardados) {
    const datos = JSON.parse(pacientesGuardados);
    listaPacientes.length = 0;

    datos.forEach(p => {
      const paciente = new Paciente(p.nombre);
      p.serviciosContratados.forEach(s => {
        paciente.agregarServicio(new Servicio(s.nombre, s.precio));
      });
      listaPacientes.push(paciente);
    });
  }
}

function actualizarSelectorPacientes() {
  selectorPacientes.innerHTML = '';

  const opcionDefault = document.createElement('option');
  opcionDefault.value = '';
  opcionDefault.textContent = '-- Seleccioná un paciente --';
  selectorPacientes.append(opcionDefault);

  listaPacientes.forEach((paciente, index) => {
    const opcion = document.createElement('option');
    opcion.value = index;
    opcion.textContent = paciente.nombre;
    selectorPacientes.append(opcion);
  });
}

function mostrarServiciosPaciente() {
  const indicePaciente = selectorPacientes.value;
  contenedorServicios.innerHTML = '';

  if (!indicePaciente) {
    botonAgregarServicio.disabled = true;
    botonFinalizarCompra.disabled = true;
    textoTotal.textContent = 'Total: $0';
    contenedorServicios.textContent = 'No hay servicios cargados.';
    return;
  }

  botonAgregarServicio.disabled = false;

  const pacienteSeleccionado = listaPacientes[indicePaciente];
  const servicios = pacienteSeleccionado.serviciosContratados;

  if (servicios.length === 0) {
    contenedorServicios.textContent = 'No hay servicios cargados.';
    textoTotal.textContent = 'Total: $0';
    botonFinalizarCompra.disabled = true;
    return;
  }

  servicios.forEach(servicio => {
    contenedorServicios.innerHTML += `
      <div class="servicio-item">
        <span>${servicio.nombre}</span>
        <span>$${servicio.precio.toFixed(2)}</span>
      </div>
    `;
  });

  const total = pacienteSeleccionado.calcularTotalServicios();
  textoTotal.textContent = `Total: $${total.toFixed(2)}`;
  botonFinalizarCompra.disabled = false;
}

botonAgregarPaciente.addEventListener('click', () => {
  const nombre = inputPacienteNombre.value.trim();

  if (!nombre) {
    alert('Por favor, ingresá un nombre válido para el paciente.');
    return;
  }

  const nuevoPaciente = new Paciente(nombre);
  listaPacientes.push(nuevoPaciente);

  guardarPacientesEnLocalStorage();
  actualizarSelectorPacientes();
  inputPacienteNombre.value = '';
  alert(`Paciente "${nombre}" agregado correctamente.`);
});

selectorPacientes.addEventListener('change', mostrarServiciosPaciente);

botonAgregarServicio.addEventListener('click', () => {
  const indicePaciente = selectorPacientes.value;

  if (!indicePaciente) {
    alert('Primero seleccioná un paciente.');
    return;
  }

  const nombreServicio = inputServicioNombre.value.trim();
  const precioServicio = parseFloat(inputServicioPrecio.value);

  if (!nombreServicio || isNaN(precioServicio) || precioServicio < 0) {
    alert('Ingresá un nombre y precio válido para el servicio.');
    return;
  }

  const nuevoServicio = new Servicio(nombreServicio, precioServicio);
  listaPacientes[indicePaciente].agregarServicio(nuevoServicio);

  guardarPacientesEnLocalStorage();
  inputServicioNombre.value = '';
  inputServicioPrecio.value = '';

  mostrarServiciosPaciente();
});

botonFinalizarCompra.addEventListener('click', () => {
  const indicePaciente = selectorPacientes.value;

  if (!indicePaciente) return;

  const paciente = listaPacientes[indicePaciente];
  const total = paciente.calcularTotalServicios();

  alert(`Compra finalizada para ${paciente.nombre}. Total a pagar: $${total.toFixed(2)}.`);

  paciente.limpiarServicios();
  guardarPacientesEnLocalStorage();
  mostrarServiciosPaciente();
});

cargarPacientesDesdeLocalStorage();
actualizarSelectorPacientes();
mostrarServiciosPaciente();
