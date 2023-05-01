const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbConfig = require("./config/db.config");

const auth = require("./middlewares/auth.js");
const errors = require("./middlewares/errors.js");
const unless = require("express-unless");

mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Banco de Dados conectado com sucesso");
    },
    (error) => {
      console.log("Erro ao conectar ao Banco de Dados: " + error);
    }
  );


auth.authenticateToken.unless = unless;
app.use(
  auth.authenticateToken.unless({
    path: [
      { url: "/users/login", methods: ["POST"] },
      { url: "/users/register", methods: ["POST"] },
      //{ url: "/users/otpLogin", methods: ["POST"] },
      //{ url: "/users/verifyOTP", methods: ["POST"] },
    ],
  })
);

app.use(express.json());

// iniciando rotas
app.use("/users", require("./routes/users.routes"));

// middleware para erros nas requisições
app.use(errors.errorHandler);


app.listen(process.env.port || 4000, function () {
  console.log("Conectando...");
});
