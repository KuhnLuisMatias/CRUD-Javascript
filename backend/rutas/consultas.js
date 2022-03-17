module.exports = function consultasHandler({
  consultas,
  veterinarias,
  mascotas,
}) {
  return {
    get: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (consultas[data.indice]) {
          return callback(200, consultas[data.indice]);
        }
        return callback(404, {
          mensaje: `consulta con indice ${data.indice} no encontrada`,
        });
      }
      const consultasConRelaciones = consultas.map((consulta) => ({
        ...consulta,
        mascota: {
          ...mascotas[consulta.mascota],
          id: consulta.mascota,
        },
        veterinaria: {
          ...veterinarias[consulta.veterinaria],
          id: consulta.veterinaria,
        },
      }));
      return callback(200, consultasConRelaciones);
    },
    post: (data, callback) => {
      let nuevaConsulta = data.payload;
      nuevaConsulta.fechaCreacion = new Date();
      nuevaConsulta.fechaEdicion = null;
      consultas = [...consultas, nuevaConsulta];
      callback(201, nuevaConsulta);
    },
    put: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (consultas[data.indice]) {
          let { fechaCreacion } = consultas[data.indice];
          consultas[data.indice] = {
            ...data.payload,
            fechaCreacion,
            fechaEdicion: new Date(),
          };
          return callback(200, consultas[data.indice]);
        }
        return callback(404, {
          mensaje: `consulta con indice ${data.indice} no encontrada`,
        });
      }
      return callback(200, consultas);
    },
    delete: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (consultas[data.indice]) {
          consultas = consultas.filter(
            (_consulta, index) => index != data.indice
          );
          return callback(204, `consulta con indice ${data.indice} eliminada.`);
        }
      }
    },
  };
};
