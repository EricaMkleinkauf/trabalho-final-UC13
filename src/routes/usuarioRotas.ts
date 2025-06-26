import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";

const router = Router();
const UsuariosController = new UsuarioController();

router.post("/cadastro", UsuariosController.cadastrar);
router.post("/login", UsuariosController.login);

export default router;
