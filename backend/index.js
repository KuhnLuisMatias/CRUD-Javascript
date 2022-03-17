const http = require("http");
const requestHandler = require('./reques-handler');
const server = http.createServer(requestHandler);

server.listen(8000, () => console.log("corriendo server"));