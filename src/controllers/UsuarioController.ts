import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source"; 
import { Usuario } from "../model/Usuario";
import bcrypt from "bcryptjs"; 

const usuarioRepository = AppDataSource.getRepository(Usuario); // Repositório da entidade Usuario

export class UsuarioController {
  async cadastrar(req: Request, res: Response) {
    const { email, senha } = req.body;

    // Verifica se os campos foram preenchidos
    if (!email || !senha) {
      res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
      return
    }

    try {
      const existe = await usuarioRepository.findOneBy({ email }); // Verifica se o e-mail já está em uso
      if (existe) {
        res.status(409).json({ mensagem: "Email já está em uso." });
        return
      }

      // Cria usuário com senha criptografada 
      const usuario = new Usuario(email, senha);
      const novoUsuario = usuarioRepository.create(usuario);
      await usuarioRepository.save(novoUsuario);

      res.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario: novoUsuario });
      return
    } catch (error) {
      res.status(500).json({ mensagem: "Erro ao criar usuário.", erro: error });
      return
    }
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    // Valida campos obrigatórios
    if (!email || !senha) {
      res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
      return
    }

    try {
      const usuario = await usuarioRepository.findOneBy({ email }); // Busca usuário pelo email
      if (!usuario) {
        res.status(404).json({ mensagem: "Email ou senha inválidos." });
        return
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha); // Compara senha
      if (!senhaValida) {
        res.status(401).json({ mensagem: "Email ou senha inválidos." });
        return
      }

      res.status(200).json({ mensagem: "Login realizado com sucesso!", usuarioId: usuario.id });
      return
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao fazer login.", erro });
      return
    }
  }
}
