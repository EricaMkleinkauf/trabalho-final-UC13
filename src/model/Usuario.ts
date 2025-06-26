import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import bcrypt from "bcryptjs";
import { Serie } from "./Serie";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", length: 225, nullable: false })
  senha: string;

  private senhaOriginal: string;

  @OneToMany(() => Serie, (serie) => serie.usuario)
  series!: Serie[];

  constructor(email: string, senha: string) {
    this.email = email;
    this.senha = senha;
    this.senhaOriginal = senha;
  }

  @AfterLoad()
  setSenhaOriginal() {
    this.senhaOriginal = this.senha;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashSenha() {
    if (this.senha !== this.senhaOriginal) {
      this.senha = await bcrypt.hash(this.senha, 10);
    }
  }
}
