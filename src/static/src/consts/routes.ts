const ROUTES = {
  HOME: {
    ME: "/home",
  },
  GAME: {
    ME: "/game",
    get TOKEN() {
      return `${this.ME}/:token`;
    },
    TOKEN_VALUE(token: string) {
      return `${this.ME}/${token}`;
    },
  },
};

export default ROUTES;
