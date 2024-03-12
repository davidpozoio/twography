const ioc = require('socket.io-client');

exports.initSocketServer = (done, namespace = '') => {
  let server, clientSocket;
  server = require('../io').testingServer();
  let url = `http://localhost:${server.address().port}${namespace}`;
  clientSocket = ioc(url);
  clientSocket.on('connect', done);

  return {
    server,
    socket: clientSocket,
    generateNewConnection: (namespace = undefined) => {
      if (namespace) {
        return ioc(`http://localhost:${server.address().port}${namespace}`);
      }
      return ioc(url);
    },
  };
};
