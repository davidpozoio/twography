const { Manager } = require('socket.io-client');

exports.initManagerServer = (done, namespaces = []) => {
  const server = require('../io').testingServer();
  let url = `http://localhost:${server.address().port}`;

  const manager = new Manager(url);
  const sockets = new Map();

  namespaces.forEach((namespace) => {
    sockets.set(namespace, manager.socket(namespace));
    sockets.get(namespace).on('connect', done);
  });

  return {
    server,
    sockets: sockets,
    generateNewConnection: () => {
      const newManager = new Manager(url);
      const newSockets = new Map();

      namespaces.forEach((namespace) => {
        newSockets.set(namespace, newManager.socket(namespace));
      });

      return newSockets;
    },
  };
};
