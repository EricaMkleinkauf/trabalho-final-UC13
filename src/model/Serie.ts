import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Entity("series")
export class Serie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  titulo: string;

  @Column({ type: "text", nullable: false })
  sinopse: string;

  @Column({ type: "int", nullable: false })
  temporada: number;

  @Column({ type: "int", nullable: false })
  episodio: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  genero: string;

  @Column({ type: "decimal", precision: 3, scale: 1, nullable: false })
  nota: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.series)
  @JoinColumn({ name: "usuario_id" })
  usuario: Usuario;

  constructor(titulo: string, sinopse: string, temporada: number, episodio: number, genero: string, nota: number, usuario: Usuario) {
    this.titulo = titulo;
    this.sinopse = sinopse;
    this.temporada = temporada;
    this.episodio = episodio;
    this.genero = genero;
    this.nota = nota;
    this.usuario = usuario;
  }
}
