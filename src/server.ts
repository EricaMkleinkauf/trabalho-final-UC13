import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import usuarioRotas from "./routes/usuarioRotas";
import serieRotas from "./routes/serieRotas";
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRotas);
app.use("/api/series", serieRotas);


app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
}))

app.use(express.static('public'));

app.get(path.join(__dirname, '../public/telaLogin.html'));


AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado!");
    app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
  })
  .catch((error) => console.log("Erro ao conectar ao banco:", error));
