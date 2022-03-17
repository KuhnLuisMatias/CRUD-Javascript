const list = document.getElementById("list-owners");
const nameOwn = document.getElementById("owner-name");
const lastName = document.getElementById("owner-last-name");
const dni = document.getElementById("owner-dni");
const country = document.getElementById("owner-country");
const btnSave = document.getElementById("btnSave");
const btnEdit = document.getElementById("btnEdit");
const indexOwner = document.getElementById("owner-index");
const url = "http://localhost:8000/duenos";

let owners = [];

btnSave.onclick = saveOwner;

async function retrieve() {
  try {
    let respuesta = await fetch(url);
    let datoServer = await respuesta.json();

    if (Array.isArray(datoServer)) {
      owners = datoServer;
      if (owners.length > 0) {
        let htmlOwners = owners
          .map(
            (own, index) =>
              `   <tr>
            <th scope="row">${index}</th>
            <td>${own.dni}</td>
            <td>${own.name}</td>
            <td>${own.lastName}</td>
            <td>${own.country}</td>
            <td>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-warning modifyOwner" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                    <button type="button" class="btn btn-danger deleteOwner">Delete</button>
                </div>
            </td>
        </tr>
    `
          )
          .join("");

        list.innerHTML = htmlOwners;

        //Add all elements of btn-group functions edit and delete
        Array.from(document.getElementsByClassName("modifyOwner")).forEach(
          (btnEdit, index) => (btnEdit.onclick = modifyOwner(index))
        );

        Array.from(document.getElementsByClassName("deleteOwner")).forEach(
          (btnDelete, index) => (btnDelete.onclick = deleteOwner(index))
        );
        return;
      } else {
        list.innerHTML = ` <tr>
            <td colspan="5">No hay dueños para mostrar.</td>          
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
  nameOwn.value = "";
  lastName.value = "";
  dni.value = "";
  country.value = "";
  btnSave.innerHTML = "Create";
}

// Save owner

async function saveOwner(e) {
  e.preventDefault();

  try {
    let own = {
      dni: dni.value,
      name: nameOwn.value,
      lastName: lastName.value,
      country: country.value,
    };

    let action = btnSave.innerHTML;
    let method = "POST";
    let urlEnvio = url;

    if (action == "Modify") {
      method = "PUT";
      urlEnvio = `${url}/${indexOwner.value}`;
      owners[indexOwner.value] = own;
    }

    const respuesta = await fetch(urlEnvio, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(own),
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
function modifyOwner(index) {
  return function handler() {
    btnSave.innerHTML = "Modify";
    let own = owners[index];
    nameOwn.value = own.name;
    lastName.value = own.lastName;
    dni.value = own.dni;
    country.value = own.country;
    indexOwner.value = index;
  };
}

//Delete
function deleteOwner(index) {
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
