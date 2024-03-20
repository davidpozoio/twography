const ROUTES = {
  HOME: {
    ME: "/home",
  },
  GAME: {
    ME: "/game",
    get TOKEN() {
      return `${this.ME}/:token`;
    },
    get JOIN() {
      return `${this.ME}/join/:token`;
    },
    JOIN_TOKEN(token: string) {
      return `${this.ME}/join/${token}`;
    },
    get START() {
      return `${this.ME}/start`;
    },
    START_TOKEN(token: string) {
      return `${this.ME}/start/${token}`;
    },
    get WAITING_ROOM() {
      return `${this.ME}/waiting-room/:token`;
    },
    WAITING_ROOM_TOKEN(token: string) {
      return `${this.ME}/waiting-room/${token}`;
    },
  },
};

export default ROUTES;
