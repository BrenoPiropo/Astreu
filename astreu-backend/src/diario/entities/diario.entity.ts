// src/diario/entities/diario.entity.ts

import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

// AJUSTE ESTA LINHA ABAIXO:
import { FotoDiario } from "../foto-diario/entities/foto-diario.entity";

@Entity("diario_bordo")
export class DiarioBordo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo_observacao: string;

  @Column("text")
  relato: string;

  @Column({ type: "datetime" })
  data_observacao: Date;

  @ManyToOne(() => User, (user) => user.diarios)
  @JoinColumn({ name: "usuario_id" })
  usuario: User;

  @OneToMany(() => FotoDiario, (foto) => foto.diario, { cascade: true })
  fotos: FotoDiario[];
}
