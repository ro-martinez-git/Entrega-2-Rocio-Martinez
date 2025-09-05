class Paciente {
  constructor(nombreCompleto, edad, diagnostico) {
    this.nombreCompleto = nombreCompleto;
    this.edad = edad;
    this.diagnostico = diagnostico;
    this.servicios = [];
  }
}

const form = document.getElementById("formPaciente");
const listaPacientesEl = document.getElementById("listaPacientes");

let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

function guardarPacientes() {
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
}

function renderPacientes() {
  listaPacientesEl.innerHTML = "";
  pacientes.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nombreCompleto} | Edad: ${p.edad} | Dx: ${p.diagnostico}`;
    listaPacientesEl.appendChild(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombrePaciente").value.trim();
  const edad = parseInt(document.getElementById("edadPaciente").value.trim());
  const diagnostico = document.getElementById("diagnosticoPaciente").value.trim();

  if (!nombre || !edad || !diagnostico) {
    Swal.fire("Error", "Todos los campos son obligatorios", "error");
    return;
  }

  const nuevo = new Paciente(nombre, edad, diagnostico);
  pacientes.push(nuevo);
  guardarPacientes();
  renderPacientes();

  form.reset();
  Swal.fire("Éxito", "Paciente agregado correctamente", "success");
});

renderPacientes();