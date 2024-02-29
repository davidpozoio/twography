const developModes = {
  prod: "prod",
  dev: "dev",
};

const environment = {
  developMode: process.env.DEVELOP_MODE || developModes.prod,
  host: process.env.HOST || 8000,
  mode: developModes,
};

module.exports = environment;
