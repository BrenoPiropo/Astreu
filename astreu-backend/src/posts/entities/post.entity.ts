import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("posts_comunidade")
export class PostComunidade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: ["article", "photo"] })
  tipo: "article" | "photo";

  @Column()
  titulo: string;

  @Column()
  url_midia: string;

  @Column({ nullable: true })
  url_pdf: string;

  @Column({ type: "text" })
  conteudo: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "usuario_id" })
  usuario: User;
}
