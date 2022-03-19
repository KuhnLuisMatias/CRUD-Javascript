const list = document.getElementById("list-veterinarians");
const nameVet = document.getElementById("veterinarian-name");
const lastName = document.getElementById("veterinarian-last-name");
const dni = document.getElementById("veterinarian-dni");
const country = document.getElementById("veterianarian-country");
const btnSave = document.getElementById("btnSave");
const btnEdit = document.getElementById("btnEdit");
const indexVeterinarian = document.getElementById("veterianarian-index");
const url = "https://veterinaria-backend-red-eight.vercel.app/veterinarias";

let veterinarians = [];

btnSave.onclick = saveVeterinarian;

async function retrieve() {
  try {
    let respuesta = await fetch(url);
    let datoServer = await respuesta.json();

    if (Array.isArray(datoServer)) {
      veterinarians = datoServer;
      if (veterinarians.length > 0) {
        let htmlVeterinarians = veterinarians
          .map(
            (vet, index) =>
              `   <tr>
                <th scope="row">${index}</th>
                <td>${vet.dni}</td>
                <td>${vet.name}</td>
                <td>${vet.lastName}</td>
                <td>${vet.country}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-warning modifyVeterinarian" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                        <button type="button" class="btn btn-danger deleteVeterinarian">Delete</button>
                    </div>
                </td>
            </tr>
        `
          )
          .join("");

        list.innerHTML = htmlVeterinarians;

        //Add all elements of btn-group functions edit and delete
        Array.from(
          document.getElementsByClassName("modifyVeterinarian")
        ).forEach(
          (btnEdit, index) => (btnEdit.onclick = modifyVeterinarian(index))
        );

        Array.from(
          document.getElementsByClassName("deleteVeterinarian")
        ).forEach(
          (btnDelete, index) => (btnDelete.onclick = deleteVeterinarian(index))
        );
        return;
      } else {
        list.innerHTML = `<tr>
        <td colspan="5">No hay veterinarios para mostrar.</td>          
      </tr>`;
      }
    }
  } catch (error) {
    $(".alert").show();
  }
}

retrieve();

//Reset modal
function resetModal() {
  nameVet.value = "";
  lastName.value = "";
  dni.value = "";
  country.value = "";
  btnSave.innerHTML = "Create";
}

// Save veterinarian
async function saveVeterinarian(e) {
  e.preventDefault();

  try {
    let vet = {
      dni: dni.value,
      name: nameVet.value,
      lastName: lastName.value,
      country: country.value,
    };

    let action = btnSave.innerHTML;
    let method = "POST";
    let urlEnvio = url;

    if (action == "Modify") {
      method = "PUT";
      urlEnvio = `${url}/${indexVeterinarian.value}`;
      veterinarians[indexVeterinarian.value] = vet;
    }

    const respuesta = await fetch(urlEnvio, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vet),
    });

    if (respuesta.ok) {
      retrieve();
      resetModal();
    }
  } catch (error) {
    throw error;
  }
}

//Modify
function modifyVeterinarian(index) {
  return function handler() {
    btnSave.innerHTML = "Modify";
    let vet = veterinarians[index];
    nameVet.value = vet.name;
    lastName.value = vet.lastName;
    dni.value = vet.dni;
    country.value = vet.country;
    indexVeterinarian.value = index;
  };
}

//Delete
function deleteVeterinarian(index) {
  let urlEnvio = `${url}/${index}`;
  return async function clickenEliminar() {
    try {
      const respuesta = await fetch(urlEnvio, {
        method: "DELETE",
      });

      if (respuesta.ok) {
        retrieve();
        resetModal();
      }
    } catch (error) {
      throw error;
    }
  };
}
