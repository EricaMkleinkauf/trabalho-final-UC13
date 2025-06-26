import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source"; 
import { Serie } from "../model/Serie"; 
import { Usuario } from "../model/Usuario";

const serieRepository = AppDataSource.getRepository(Serie); // Repositório da Serie
const usuarioRepository = AppDataSource.getRepository(Usuario); // Repositório do Usuario

export class SerieController {
  async criar(req: Request, res: Response) {
    const { titulo, sinopse, temporada, episodio, genero, nota, usuarioId } = req.body;

    // Valida se todos os campos estão preenchidos
    if (!titulo || !sinopse || !temporada || !episodio || !genero || nota === undefined || !usuarioId) {
       res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
       return;
    }

    try {
      // Verifica se o usuário existe
      const usuario = await usuarioRepository.findOneBy({ id: usuarioId });
      if (!usuario) {
        res.status(404).json({ mensagem: "Usuário não encontrado." });
        return;
      }

      // Cria a instância da série e salva
      const serie = new Serie(titulo, sinopse, temporada, episodio, genero, nota, usuario);
      const novaSerie = serieRepository.create(serie);
      await serieRepository.save(novaSerie);

      res.status(201).json({ mensagem: "Série criada com sucesso!", serie: novaSerie });
      return;
    } catch (erro) {
     res.status(500).json({ mensagem: "Erro ao criar série.", erro });
     return;
    }
  }

  async listarPorUsuario(req: Request, res: Response) {
    const usuarioId = Number(req.params.usuarioId);

    try {
      // Lista todas as séries do usuário
      const series = await serieRepository.find({
        where: { usuario: { id: usuarioId } },
        order: { id: "DESC" },
      });

     res.status(200).json(series);
     return;
    } catch (erro) {
     res.status(500).json({ mensagem: "Erro ao listar séries.", erro });
     return;
    }
  }

  async buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
      const serie = await serieRepository.findOneBy({ id });
      if (!serie) {
        res.status(404).json({ mensagem: "Série não encontrada." });
        return;
      }
      res.status(200).json(serie);
      return
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao buscar série.", erro });
      return
    }
  }

  async atualizar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { titulo, sinopse, temporada, episodio, genero, nota } = req.body;

    // Valida os campos obrigatórios
    if (!titulo || !sinopse || !temporada || !episodio || !genero || nota === undefined) {
      res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
      return
    }

    try {
      // Busca série existente
      const serie = await serieRepository.findOneBy({ id });
      if (!serie) {
        res.status(404).json({ mensagem: "Série não encontrada." });
        return
      }

      // Atualiza os dados
      serie.titulo = titulo;
      serie.sinopse = sinopse;
      serie.temporada = temporada;
      serie.episodio = episodio;
      serie.genero = genero;
      serie.nota = nota;

      await serieRepository.save(serie);

      res.status(200).json({ mensagem: "Série atualizada com sucesso.", serie });
      return
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao atualizar série.", erro });
      return
    }
  }

  async deletar(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
      const serie = await serieRepository.findOneBy({ id });
      if (!serie) {
        res.status(404).json({ mensagem: "Série não encontrada." });
        return
      }

      await serieRepository.remove(serie); // Remove a série do banco

      res.status(200).json({ mensagem: "Série deletada com sucesso." });
      return
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao deletar série.", erro });
      return
    }
  }
}