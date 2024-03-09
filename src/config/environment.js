const developModes = {
  prod: "prod",
  dev: "dev",
};

const environment = {
  developMode: process.env.DEVELOP_MODE || developModes.prod,
  port: process.env.PORT || 8080,
  mode: developModes,
  secret: process.env.SECRET || "secret",
};

module.exports = environment;
