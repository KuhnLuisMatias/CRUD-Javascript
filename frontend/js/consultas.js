const list = document.getElementById("lista-consultas");
const mascota = document.getElementById("mascota");
const veterinaria = document.getElementById("veterinaria");
const historia = document.getElementById("historia");
const diagnostico = document.getElementById("diagnostico");
const indexPet = document.getElementById("pet-index");
const btnGuardar = document.getElementById("btnSave");
const formulario = document.getElementById("formulario");

const url = "https://veterinaria-backend-red-eight.vercel.app";

let consultas = [];
let mascotas = [];
let veterinarias = [];

btnGuardar.onclick = saveConsulta;

retrieveVeterinarias();

retrieveMascotas();

retrieve();

async function retrieve() {
  let entidad = "consultas";
  try {
    let respuesta = await fetch(`${url}/${entidad}`);
    let datoServer = await respuesta.json();

    if (Array.isArray(datoServer)) {
      consultas = datoServer;
      if (consultas.length > 0) {
        let htmlConsulta = consultas
          .map(
            (consulta, index) =>
              `   <tr>
              <th scope="row">${index}</th>
              <td>${consulta.mascota.name}</td>
              <td>${consulta.veterinaria.name} ${consulta.veterinaria.lastName}</td>
              <td>${consulta.diagnostico}</td>
              <td>${consulta.fechaCreacion}</td>
              <td>${consulta.fechaEdicion}</td>
              <td>
                  <div class="btn-group" role="group">
                      <button type="button" class="btn btn-warning modificarConsulta" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                      <button type="button" class="btn btn-danger eliminarConsulta">Delete</button>
                  </div>
              </td>
          </tr>
      `
          )
          .join("");
        list.innerHTML = htmlConsulta;
        //Add all elements of btn-group functions edit and delete
        Array.from(
          document.getElementsByClassName("modificarConsulta")
        ).forEach(
          (btnEdit, index) => (btnEdit.onclick = modificarConsulta(index))
        );

        Array.from(document.getElementsByClassName("eliminarConsulta")).forEach(
          (btnDelete, index) => (btnDelete.onclick = eliminarConsulta(index))
        );
        return;
      }
    }
  } catch (error) {
    $(".alert").show();
  }
}

async function retrieveMascotas() {
  let entidad = "mascotas";
  try {
    let respuesta = await fetch(`${url}/${entidad}`);
    let datoServer = await respuesta.json();

    if (Array.isArray(datoServer)) {
      mascotas = datoServer;
      if (respuesta.ok) {
        let htmlMascota = mascotas
          .map((obj, index) => {
            let optionActual = document.createElement("option");
            optionActual.innerHTML = obj.name;
            optionActual.value = index;
            mascota.appendChild(optionActual);
          });        
      }
    }
  } catch (error) {}
}

async function retrieveVeterinarias() {
  let entidad = "veterinarias";
  try {
    let respuesta = await fetch(`${url}/${entidad}`);
    let datoServer = await respuesta.json();

    if (Array.isArray(datoServer)) {
      veterinarias = datoServer;
      if (respuesta.ok) {
        let htmlVeterinaria = veterinarias
          .map((obj, index) => {
            let optionActual = document.createElement("option");
            optionActual.innerHTML = obj.name + " " + obj.lastName;
            optionActual.value = index;
            veterinaria.appendChild(optionActual);
          });          
      }
    }
  } catch (error) {}
}

//Modify
function modificarConsulta(index) {
  return function handler() {
    btnSave.innerHTML = "Modify";
    let consulta = consultas[index];
    mascota.value = consulta.mascota.id;
    veterinaria.value = consulta.veterinaria.id;
    historia.value = consulta.historia;
    diagnostico.value = consulta.diagnostico;
    indexPet.value = index;
  };
}

//Crear consulta
async function saveConsulta(e) {
  e.preventDefault();  
  let entidad = "consultas";
  try {
    let consulta = {
      mascota: mascota.value,
      veterinaria: veterinaria.value,
      historia: historia.value,
      diagnostico: diagnostico.value      
    };

    if (validar(consulta) === true) {

        let action = btnSave.innerHTML;
        let urlEnvio = `${url}/${entidad}`;
        let method = "POST";
        if (action == "Modify") {
          method = "PUT";
          urlEnvio += `/${indexPet.value}`;
        }
      const respuesta = await fetch(urlEnvio, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consulta),
        mode: "cors"
      });

      
      if (respuesta.ok) {
        retrieve();
        resetModal();
      }
      formulario.classList.add("was-validated");
      return;
    } $("#alertamodal").show();
      
  } catch (error) {}
}

//Delete
function eliminarConsulta(index) {
  let entidad = "consultas";
  let urlEnvio = `${url}/${entidad}/${index}`;

  return async function clickenEliminar() {
    try {
      const respuesta = await fetch(urlEnvio, {
        method: "DELETE",
      });

      if (respuesta.ok) {
        retrieve();
        resetModal();
      }
    } catch (error) {}
  };
}

//Reset modal
function resetModal() {
 
  btnSave.innerHTML = "Create";
  [indexPet, mascota, veterinaria, historia, diagnostico].forEach(
 
    (inputActual) => {      
      inputActual.value = "";      
      inputActual.classList.remove("is-invalid");
      inputActual.classList.remove("is-valid");
    }
  );  
  $("#exampleModal").modal("toggle");
  $("#alertamodal").hide();
}

function validar(datos) {
  if (typeof datos !== "object") return false;
  let respuesta = true;
  for (let llave in datos) {
    if (datos[llave].length === 0) {
      document.getElementById(llave).classList.add('is-invalid');
      respuesta = false;
    }
    else
    {
      document.getElementById(llave).classList.remove('is-invalid');
      document.getElementById(llave).classList.add('is-valid');
    }
  }
  if (respuesta === true) $("#alertamodal").hide();
  return respuesta;
}
