module.exports = function mascotasHandler(mascotas) {
  return {
    get: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (mascotas[data.indice]) {
          return callback(200, mascotas[data.indice]);
        }
        return callback(404, {
          mensaje: `Mascota con indice ${data.indice} no encontrada`,
        });
      }
      return callback(200, mascotas);
    },
    post: (data, callback) => {
      mascotas.push(data.payload);
      callback(201, data.payload);
    },
    put: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (mascotas[data.indice]) {
          mascotas[data.indice] = data.payload;
          return callback(200, mascotas[data.indice]);
        }
        return callback(404, {
          mensaje: `Mascota con indice ${data.indice} no encontrada`,
        });
      }
      return callback(200, mascotas);
    },
    delete: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (mascotas[data.indice]) {
          mascotas = mascotas.filter((_mascota, index) => index != data.indice);
          return callback(204, `Mascota con indice ${data.indice} eliminada.`);
        }
      }
    },
  };
};
