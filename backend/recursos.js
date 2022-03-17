module.exports = {
  mascotas: [
    { name: "Ollie", type: "Dog", owner: "Matias" },
    { name: "Jazmin", type: "Dog", owner: "Matias" },
    { name: "Roco", type: "Dog", owner: "Gonzalo" },    
  
  ],
  veterinarias: [
    { 
      dni: "123",
     name: "Luis Matias",
      lastName: "Kuhn",
       country: "Argentina" },
    {
      dni: "456",
      name: "Maria Barbara",
      lastName: "Ledezma",
      country: "Argentina",
    },
  ],
  duenos: [
    {
      dni: "123",
      name: "Luis Carlos",
      lastName: "Kuhn",
      country: "Argentina",
    },
  ],
  consultas: [
    {
      mascota: 0,
      veterinaria: 0,
      fechaCreacion: new Date(),
      fechaEdicion: new Date(),
      historia: "",
      diagnostico: "ejemplo",
    },
  ],
};
