module.exports = function duenosHandler(duenos) {
    return {
      get: (data, callback) => {
        if (typeof data.indice !== "undefined") {
          if (duenos[data.indice]) {
            return callback(200, duenos[data.indice]);
          }
          return callback(404, {
            mensaje: `dueno con indice ${data.indice} no encontrada`,
          });
        }
        return callback(200, duenos);
      },
      post: (data, callback) => {
        duenos.push(data.payload);
        callback(201, data.payload);
      },
      put: (data, callback) => {
        if (typeof data.indice !== "undefined") {
          if (duenos[data.indice]) {
            duenos[data.indice] = data.payload;
            return callback(200, duenos[data.indice]);
          }
          return callback(404, {
            mensaje: `dueno con indice ${data.indice} no encontrada`,
          });
        }
        return callback(200, duenos);
      },
      delete: (data, callback) => {
        if (typeof data.indice !== "undefined") {
          if (duenos[data.indice]) {
            duenos = duenos.filter((_dueno, index) => index != data.indice);
            return callback(204, `dueno con indice ${data.indice} eliminada.`);
          }
        }
      },
    };
  };
  