const SOCKET = {
  ERROR: 'error',
  ROOM: {
    NAMESPACE: '/room',
    CREATE: 'room:create',
  },
  GAME: {
    NAMESPACE: '/game',
    JOIN: 'game:join',
    START: 'game:start',
  },
};

module.exports = { SOCKET };
