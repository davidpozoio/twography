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
    TEXT: 'game:text',
    RANDOM_TEXT: 'game:random-text',
    WINNER: 'game:winner',
  },
};

module.exports = { SOCKET };
