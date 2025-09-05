const selectPaciente = document.getElementById("selectPaciente");
const inputServicio = document.getElementById("nombreServicio");
const inputPrecio = document.getElementById("precioServicio");
const listaServiciosEl = document.getElementById("listaServicios");
const totalEl = document.getElementById("total");

let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
let comprasRealizadas = JSON.parse(localStorage.getItem("comprasRealizadas")) || [];
let pacienteActivo = null;

function cargarPacientes() {
  selectPaciente.innerHTML = "<option value=''>-- Selecciona --</option>";
  pacientes.forEach((p, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = p.nombreCompleto;
    selectPaciente.appendChild(option);
  });
}

function renderServicios() {
  if (!pacienteActivo) return;
  listaServiciosEl.innerHTML = "";
  let total = 0;
  pacienteActivo.servicios.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.nombre} - $${s.precio}`;
    listaServiciosEl.appendChild(li);
    total += s.precio;
  });
  totalEl.textContent = total.toFixed(2);
}

selectPaciente.addEventListener("change", () => {
  const idx = selectPaciente.value;
  pacienteActivo = pacientes[idx] || null;
  if (!pacienteActivo) return;
  renderServicios();
});

document.getElementById("btnAgregarServicio").addEventListener("click", () => {
  if (!pacienteActivo) {
    Swal.fire({
      icon: "warning",
      title: "Paciente no encontrado",
      text: "Debes crear al paciente antes de facturar.",
      confirmButtonText: "Ir a Pacientes"
    }).then(res => {
      if (res.isConfirmed) window.location.href = "paciente.html";
    });
    return;
  }

  const nombre = inputServicio.value.trim();
  const precio = parseFloat(inputPrecio.value.trim());

  if (!nombre || isNaN(precio)) {
    Swal.fire("Error", "Completa servicio y precio", "error");
    return;
  }

  pacienteActivo.servicios.push({ nombre, precio });
  localStorage.setItem("pacientes", JSON.stringify(pacientes));

  renderServicios();
  inputServicio.value = "";
  inputPrecio.value = "";
});

document.getElementById("btnFinalizar").addEventListener("click", () => {
  if (!pacienteActivo || pacienteActivo.servicios.length === 0) {
    Swal.fire("Atención", "No hay servicios cargados", "info");
    return;
  }

  let total = pacienteActivo.servicios.reduce((sum, s) => sum + s.precio, 0);


  const compra = {
    paciente: pacienteActivo.nombreCompleto,
    servicios: [...pacienteActivo.servicios],
    total,
    fecha: new Date().toLocaleString()
  };
  comprasRealizadas.push(compra);
  localStorage.setItem("comprasRealizadas", JSON.stringify(comprasRealizadas));

  Swal.fire({
    icon: "success",
    title: "Compra finalizada",
    html: `
      <p><b>Paciente:</b> ${pacienteActivo.nombreCompleto}</p>
      <p><b>Total:</b> $${total.toFixed(2)}</p>
    `
  });


  pacienteActivo.servicios = [];
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  renderServicios();
});

cargarPacientes();
