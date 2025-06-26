import { Router } from "express";
import { SerieController } from "../controllers/SerieController";

const router = Router();
const serieController = new SerieController();

router.post("/", serieController.criar);
router.get("/usuario/:usuarioId",serieController.listarPorUsuario);
router.get("/:id", serieController.buscarPorId);
router.put("/editar/:id", serieController.atualizar);
router.delete("/deletar/:id", serieController.deletar);

export default router;
