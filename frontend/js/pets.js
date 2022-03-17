const list = document.getElementById("list-animals");
const btnSave = document.getElementById("btnSave");
const namePet = document.getElementById("pet-name");
const typePet = document.getElementById("pet-type");
const ownerPet = document.getElementById("pet-owner");
const indexPet = document.getElementById("pet-index");
const url = "http://veterinaria-backend-red-eight.vercel.app/mascotas";

let pets = [];

btnSave.onclick = savePet;

async function retrieve() {
  try {
    let respuesta = await fetch(url);
    let mascotasDelServer = await respuesta.json();
    if (Array.isArray(mascotasDelServer)) {
      pets = mascotasDelServer;
      if (pets.length > 0) {
        let htmlPets = pets
          .map(
            (pet, index) => `
        <tr>
          <th scope="row">${index}</th>
          <td>${pet.name}</td>
          <td>${pet.type}</td>
          <td>${pet.owner}</td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn btn-warning editPet" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
              <button type="button" class="btn btn-danger deletePet">Delete</button>
            </div>
          </td>
        </tr>`
          )
          .join("");
        list.innerHTML = htmlPets;
        Array.from(document.getElementsByClassName("editPet")).forEach(
          (btnEdit, index) => (btnEdit.onclick = modifyPet(index))
        );

        Array.from(document.getElementsByClassName("deletePet")).forEach(
          (btnDelete, index) => (btnDelete.onclick = deletePet(index))
        );
        return;
      }
      else{
        list.innerHTML = 
        ` <tr>
            <td colspan="5">No hay mascotas para mostrar.</td>          
          </tr>`;
      }
    }
  } catch (error) {    
    $('.alert').show();
  }
}

retrieve();

//reset
function resetModal() {
  namePet.value = "";
  typePet.value = "";
  indexPet.value = "";
  btnSave.innerHTML = "Create";
}

//Save
async function savePet(e) {
  e.preventDefault();

  try {
    let pet = {
      name: namePet.value,
      type: typePet.value,
      owner: ownerPet.value,
    };
    let action = btnSave.innerHTML;
    let method = "POST";
    let urlEnvio = url;

    if (action === "Edit") {
      method = "PUT";
      urlEnvio = `${url}/${indexPet.value}`;
      console.log(urlEnvio.value);
      pets[indexPet.value] = pet;
    }

    const respuesta = await fetch(urlEnvio, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pet),
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
function modifyPet(index) {
  return function handler() {
    btnSave.innerHTML = "Edit";

    let pet = pets[index];
    namePet.value = pet.name;
    typePet.value = pet.type;
    ownerPet.value = pet.owner;
    indexPet.value = index;
  };
}

//Delete
function deletePet(index) {
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
