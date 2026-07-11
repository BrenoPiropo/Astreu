import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("metas_exploracao")
export class Meta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: "enum", enum: ["aberto", "concluída"], default: "aberto" })
  status: "aberto" | "concluída";

  @ManyToOne(() => User, (user) => user.metas)
  @JoinColumn({ name: "usuario_id" })
  usuario: User;
}
