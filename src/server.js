const app = require("./app");
const environment = require("./config/environment");

app.listen(environment.host, () => {
  console.log("server has started in port " + environment.host);
});
